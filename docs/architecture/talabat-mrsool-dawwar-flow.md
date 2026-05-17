# How Talabat & Mrsool Work — Order Flow, Payment System & How to Apply It to Dawwar

> Written as an expert engineering guide. This document explains how the two biggest delivery platforms in the Middle East handle order flow and money movement — then maps every concept directly to what you need to build in Dawwar.

---

## Table of Contents

1. [The Big Picture — What These Platforms Actually Are](#1-the-big-picture)
2. [Order Flow — How Talabat Does It](#2-order-flow--how-talabat-does-it)
3. [Order Flow — How Mrsool Does It (The Differences)](#3-order-flow--how-mrsool-does-it)
4. [Payment System — How Money Moves](#4-payment-system--how-money-moves)
5. [Commission & Settlement — The Business Engine](#5-commission--settlement)
6. [The Real-Time Layer — Sockets & Notifications](#6-the-real-time-layer)
7. [How to Apply All of This to Dawwar](#7-how-to-apply-all-of-this-to-dawwar)
8. [Common Mistakes & How to Avoid Them](#8-common-mistakes)

---

# 1. The Big Picture

## What Talabat and Mrsool Actually Are

Both apps are **three-sided marketplaces**. They do not cook food, own stores, or employ drivers. They are software that connects three groups of people and take a cut of every transaction that passes through.

```
┌──────────────┐     places order     ┌──────────────────┐
│   CUSTOMER   │ ────────────────────► │                  │
│              │                       │    PLATFORM      │
│              │ ◄──────────────────── │  (Talabat /      │
└──────────────┘   delivers, tracks    │   Mrsool /       │
                                       │   Dawwar)        │
┌──────────────┐     receives order    │                  │
│   MERCHANT   │ ◄──────────────────── │                  │
│  (restaurant │                       │                  │
│   / store)   │ ────────────────────► │                  │
└──────────────┘    gets paid (- fee)  │                  │
                                       │                  │
┌──────────────┐    gets assigned      │                  │
│    DRIVER    │ ◄──────────────────── │                  │
│   (rider /   │                       │                  │
│   courier)   │ ────────────────────► │                  │
└──────────────┘   earns delivery fee  └──────────────────┘
```

The platform earns money by sitting in the middle. Every EGP that flows between a customer and a merchant passes through the platform's ledger first.

## The Key Insight

The order flow and the money flow are two **separate but synchronized systems**:

- **Order flow** = status machine + real-time notifications (sockets + push)
- **Money flow** = ledger mutations that happen at specific status transitions

You must build both, and they must be in sync. An order reaching `COMPLETED` must **atomically** trigger the right wallet movements. If the status changes but the money doesn't move, you have a broken system. If the money moves but the status is wrong, you have a worse problem.

---

# 2. Order Flow — How Talabat Does It

## The 7 Stages of a Talabat Order

Talabat's order lifecycle is a strict state machine. Every stage has a clear owner, a clear action, and a clear set of notifications that fire.

### Stage 1 — Discovery & Cart (Customer)

The customer opens the app. The platform immediately uses their GPS location to show **only merchants that can deliver to that address**. This is not a simple list — it's a ranked list based on:

- Distance from customer
- Estimated delivery time
- Restaurant rating
- Whether the merchant paid for a sponsored slot
- Whether the merchant is currently `isOpen: true`

The customer browses the menu. The menu is organized by **category groups** (Burgers, Sides, Drinks). When they add items to cart, the app checks that all items are from the same merchant. If they try to add from a different merchant, a conflict dialog appears: "Your cart has items from [Merchant A]. Clear cart and start a new order from [Merchant B]?"

The cart lives entirely in local state (Redux + MMKV persistence in Dawwar's case). No API calls happen during browsing.

### Stage 2 — Checkout (Customer → Platform)

When the customer taps "Checkout":

1. They confirm their **delivery address** (from saved addresses or a new map pin)
2. They select a **payment method**: Card, Wallet, or Cash
3. They optionally apply a **promo code**
4. They review the breakdown: subtotal + delivery fee + discount = total
5. They tap **Place Order**

At this point, one API call fires: `POST /orders`. The backend does several things simultaneously in a single database transaction:

- Creates the `OrderEntity` with status `PENDING`
- Creates an `OrderEvent` record: `{ status: PENDING, timestamp }`
- If payment is WALLET: verifies the customer has sufficient balance (does not debit yet — that happens on completion)
- If payment is ONLINE: creates a payment intent with the payment gateway (Paymob for Egypt)
- Generates a human-readable `orderNumber` (e.g. `ORD-12345`)
- Returns the created order to the frontend

The customer is immediately redirected to the **Tracking Screen**. From this moment, they are listening on the `order:{orderId}` socket room for status updates.

### Stage 3 — Merchant Notification & Acceptance (Merchant)

The moment the order is created, the backend emits a socket event to the `merchant:{merchantId}` room. The merchant app receives this in real time.

**What Talabat Partner does here (and Dawwar should too):**
- The screen plays a **sound alert** (a specific chime, not a silent push)
- A new order card slides to the top of the incoming orders list
- The card shows: items, quantities, total, payment method (very important — merchant needs to know if it's cash), and a countdown timer
- The merchant has **~90 seconds to accept or reject**. If they don't respond, Talabat auto-rejects and notifies the customer

**Acceptance flow:**
1. Merchant taps **Accept**
2. A bottom sheet asks: "How long to prepare?" — options are 5, 10, 15, 20, 30 minutes (never a text input)
3. Merchant selects prep time and confirms
4. Backend receives `PATCH /orders/:id/accept` with `{ prepTime: 15 }`
5. Order status → `ACCEPTED`
6. Backend emits `ORDER_STATUS_CHANGED` to `order:{orderId}` room
7. Customer tracking screen updates: "Order accepted! Ready in ~15 minutes"

**Rejection flow:**
1. Merchant taps **Reject** (usually because an item is out of stock)
2. Backend receives `PATCH /orders/:id/reject`
3. Order status → `REJECTED`
4. Customer is notified immediately
5. If payment was ONLINE or WALLET: full refund is initiated immediately

### Stage 4 — Merchant Marks Ready (Merchant)

After preparing the food, the merchant taps **Order Ready**. This is critical because it triggers driver assignment.

1. Merchant taps **Ready**
2. `PATCH /orders/:id/ready`
3. Order status → `READY`
4. Backend **triggers driver assignment algorithm**
5. Customer sees: "Your order is ready! Looking for a driver..."

### Stage 5 — Driver Assignment (Platform / Backend)

This is the most technically complex stage. The backend must find the best available driver. Talabat uses a sophisticated dispatch algorithm. For Dawwar's scale, the algorithm should be:

```
1. Query drivers where:
   - isApproved = true
   - isOnline = true
   - hasActiveOrder = false
   - distance from merchant < configurable radius (e.g. 5km)

2. Sort by: distance from merchant (nearest first)

3. Ping the first driver with the order details

4. Driver has 30 seconds to accept

5. If driver accepts → ASSIGNED
   If driver rejects or times out → repeat with next driver

6. If no driver available after N attempts → notify admin
```

When a driver accepts:
1. Order status → `ASSIGNED`
2. Driver joins the `order:{orderId}` socket room
3. `ORDER_STATUS_CHANGED` (ASSIGNED) emitted to all in the room
4. Customer sees: "Driver [name] is on the way to the restaurant"
5. Customer map now shows the driver's pin

### Stage 6 — Driver Pickup (Driver)

1. Driver navigates to the merchant location using in-app map
2. Driver is actively emitting `DRIVER_LOCATION_UPDATE` every 2 seconds
3. These updates are forwarded to the customer's tracking screen as `DRIVER_LOCATION` events
4. Driver arrives at merchant, picks up the order
5. Merchant hands over the food and marks it as given (or driver marks pickup)
6. `PATCH /orders/:id/pickup`
7. Order status → `PICKED_UP`
8. Customer sees: "Your driver has picked up your order and is heading to you"
9. Customer map now shows driver heading toward the customer's address

### Stage 7 — Delivery & Completion (Driver → Settlement)

1. Driver arrives at customer location
2. Driver taps **Mark as Delivered**
3. `PATCH /orders/:id/deliver`
4. Order status → `DELIVERED`
5. **Settlement runs** (see Section 5 for details)
6. Order status → `COMPLETED`
7. All parties notified: `ORDER_STATUS_CHANGED` (COMPLETED)
8. Customer sees: "Your order has been delivered! Enjoy 🎉"
9. Customer is prompted to rate the food and the driver

## Talabat's State Machine — Visual Map

```
                    ┌──────────┐
                    │ PENDING  │  ← order placed by customer
                    └────┬─────┘
                         │ merchant accepts
              ┌──────────▼──────────┐
              │      ACCEPTED       │  ← merchant confirmed, prep time set
              └──────────┬──────────┘
                         │ merchant marks ready
              ┌──────────▼──────────┐
              │        READY        │  ← food prepared, waiting for driver
              └──────────┬──────────┘
                         │ driver assigned by system
              ┌──────────▼──────────┐
              │      ASSIGNED       │  ← driver accepted, heading to merchant
              └──────────┬──────────┘
                         │ driver picks up
              ┌──────────▼──────────┐
              │     PICKED_UP       │  ← driver heading to customer
              └──────────┬──────────┘
                         │ driver delivers
              ┌──────────▼──────────┐
              │      DELIVERED      │  ← settlement runs here
              └──────────┬──────────┘
                         │ settlement confirmed
              ┌──────────▼──────────┐
              │      COMPLETED      │  ← final state, money moved
              └─────────────────────┘

   Exits at any stage:
   PENDING    → CANCELLED  (customer cancels before acceptance)
   PENDING    → REJECTED   (merchant rejects)
   ACCEPTED   → CANCELLED  (merchant cancels after acceptance — rare)
```

---

# 3. Order Flow — How Mrsool Does It (The Differences)

Mrsool operates slightly differently from Talabat. Understanding these differences helps you make conscious choices about which model to follow for Dawwar.

## Key Difference 1: Open Courier Network vs. Employed Fleet

**Talabat:** Uses a mix of employed riders and independent contractors. The dispatch algorithm assigns orders automatically. Riders cannot browse available orders — they get pinged.

**Mrsool:** Was originally a fully open courier network. Any registered courier could see all available orders in their area and bid on them. The customer sees the courier's proposed price and accepts or declines.

**Dawwar should use:** The Talabat model (sequential auto-assignment). The Mrsool auction model is more complex to build and manage at small scale, and drivers end up racing each other which creates a bad user experience.

## Key Difference 2: What Can Be Ordered

**Talabat:** Restaurant and grocery only. Structured menus. Every item has a fixed price listed by the merchant.

**Mrsool:** "Order anything." The customer types what they want in free text. A courier goes and buys it and delivers it. Mrsool is fundamentally a courier-on-demand service with a structured store layer added on top.

**Dawwar should use:** The Talabat model (structured merchant menus with fixed prices). The free-text model requires a very different backend — couriers must photograph receipts, handle price variations, etc.

## Key Difference 3: Driver Experience

**Mrsool:** Drivers set their own availability and browse orders. The home screen is a map with available orders shown as pins.

**Talabat:** Drivers get assigned. They can toggle online/offline. When an order is assigned, a full-screen modal appears. They can reject once.

**Dawwar should use:** The Talabat model (push assignment) with the Mrsool driver home screen UX (full-screen map). Best of both.

## What Mrsool Does Better Than Talabat

1. **Driver home = map** — Mrsool driver's home screen is a full-screen map. Talabat's is more list-based. The map is better for spatial awareness.
2. **Driver earnings are front and center** — Mrsool shows today's earnings immediately on the home screen. Talabat buries it in a profile tab.
3. **Real-time chat between customer and driver** — Mrsool has in-app chat during an active order. Talabat does not (they use push notifications only). This is a nice-to-have for Dawwar v2.

---

# 4. Payment System — How Money Moves

## The Three Payment Methods

Both Talabat and Mrsool support the same three payment archetypes. Understanding how each one flows technically is essential.

---

## Payment Method 1: CASH

This is the simplest method technically, but the most complex operationally.

### How It Works in Talabat/Mrsool

- Customer pays the driver in physical cash at the door
- The platform never touches this money
- The driver owes the platform its commission from cash collected (deducted from future wallet earnings or periodic settlement)
- The merchant is paid by the platform separately on a weekly cycle

### How It Works in Dawwar (Apply This)

```
Customer places CASH order
        │
        ▼
Order created (no wallet debit from customer)
        │
        ▼
Order flows through normal lifecycle
        │
        ▼
Driver marks DELIVERED
        │
        ▼
Settlement runs:
  ├── Merchant wallet CREDITED: subtotal - merchantCommission
  ├── Driver wallet CREDITED:   deliveryFee + tipAmount - driverCommission
  └── Platform keeps:           merchantCommission + driverCommission
        │
        ▼
COMPLETED
```

**The key point:** With CASH, the platform credits the merchant and driver from its own operating balance, because the customer paid the driver directly in cash. The platform then collects that commission owed by the driver over time (from future digital earnings or periodic reconciliation).

For Dawwar at small scale: just credit merchant and driver wallets on completion of CASH orders. The commission deduction is the platform revenue.

---

## Payment Method 2: WALLET (In-App Balance)

This is the cleanest method technically — everything is internal.

### How It Works in Talabat/Mrsool

- Customer has pre-loaded credit in their in-app wallet
- At checkout, the platform verifies balance >= order total
- The funds are reserved (not debited yet) when the order is placed
- On delivery, the reserved amount is atomically split and distributed

### How It Works in Dawwar (Apply This)

```
Customer places WALLET order
        │
        ▼
Backend checks: customer.wallet.balance >= order.total
If insufficient → return 400, order not created
        │
        ▼ (sufficient balance confirmed)
Order created
Option A: Debit customer immediately (hold the funds)
Option B: Debit customer on completion
          ← Dawwar should use Option A (debit on order placement)
          ← This prevents the customer spending the balance elsewhere
        │
        ▼
Customer wallet DEBITED: total amount
WalletTransaction: { type: DEBIT, reason: ORDER_PAYMENT, referenceId: "ORDER_PAY_ORD-12345" }
        │
        ▼
Order flows through normal lifecycle
        │
        ▼
Driver marks DELIVERED
        │
        ▼
Atomic settlement (all in one DB transaction):
  ├── Merchant wallet CREDITED: subtotal - merchantCommission
  │   WalletTransaction: { type: CREDIT, reason: ORDER_PAYMENT, referenceId: "MERCHANT_ORD-12345" }
  │
  ├── Driver wallet CREDITED: deliveryFee + tipAmount - driverCommission
  │   WalletTransaction: { type: CREDIT, reason: DELIVERY_FEE, referenceId: "DRIVER_ORD-12345" }
  │
  └── (Platform's commission = customerDebit - merchantCredit - driverCredit)
        │
        ▼
COMPLETED

If order is CANCELLED or REJECTED before DELIVERED:
  └── Full refund: customer wallet CREDITED back with same total
      WalletTransaction: { type: CREDIT, reason: ORDER_PAYMENT, referenceId: "REFUND_ORD-12345" }
```

### The Critical Safety Rule: Pessimistic Locking

When multiple orders complete at the same time, the server might try to credit the same merchant wallet twice simultaneously. Without locking, this causes a race condition where both transactions read the same `balance`, add to it, and both write back — losing one credit.

```typescript
// ❌ BROKEN — race condition
const wallet = await walletRepo.findOne({ userId: merchantId });
wallet.balance += creditAmount; // two processes read same value
await walletRepo.save(wallet);  // second save overwrites first

// ✅ CORRECT — pessimistic lock in TypeORM
await dataSource.transaction(async (manager) => {
  const wallet = await manager.findOne(WalletEntity, {
    where: { userId: merchantId },
    lock: { mode: 'pessimistic_write' }, // DB-level row lock
  });

  const balanceBefore = wallet.balance;
  wallet.balance += creditAmount;

  await manager.save(wallet);

  await manager.save(WalletTransactionEntity, {
    walletId: wallet.id,
    type: 'CREDIT',
    reason: 'ORDER_PAYMENT',
    amount: creditAmount,
    balanceBefore,
    balanceAfter: wallet.balance,
    referenceId: `MERCHANT_${orderNumber}`,
  });
});
```

---

## Payment Method 3: ONLINE (Card via Payment Gateway)

This is the most complex method. In Egypt, the payment gateway is **Paymob**. In Saudi Arabia, Mrsool uses **Mada** and international cards. In UAE, Talabat uses **Network International** and **Checkout.com**.

### How Payment Gateways Work (The Technical Reality)

A payment gateway is not a simple "charge card" API. It has two separate phases:

```
AUTHORIZATION (instant, < 500ms)
  Customer's bank checks:
  - Does this card exist?
  - Does the customer have the funds?
  - Is this transaction suspicious?
  → If yes to all: funds are RESERVED on the customer's account
  → The card is NOT charged yet — funds are just held

CAPTURE (triggered by merchant/platform later)
  Platform calls the gateway: "Now actually take the money"
  → Funds move from customer's bank to the platform's account
  → Typically happens on delivery
```

### Why Two Phases?

Because the customer orders food at 7pm but receives it at 7:45pm. If you charge immediately and then the restaurant rejects the order, you have to issue a refund. Refunds take 3-7 business days on card. This creates a terrible customer experience.

Instead: authorize at order placement (instant, no money moves), capture at delivery (money moves when goods are delivered). If the order is rejected or cancelled, you simply release the authorization. The customer never sees a charge or a refund — the hold just disappears.

### How It Works in Dawwar with Paymob

```
Step 1 — Customer places ONLINE order:
  Backend calls Paymob API:
    POST /v1/intention
    { amount: 17000, currency: "EGP", items: [...] }
  Paymob returns: { client_secret: "pi_xxx", payment_key: "pk_xxx" }
  Backend returns payment_key to frontend

Step 2 — Customer completes payment in Paymob UI:
  Frontend opens Paymob hosted page or iframe with payment_key
  Customer enters card details on Paymob's page (not your app)
  Paymob authorizes with the bank

Step 3 — Paymob fires webhook to your backend:
  POST /payments/webhook
  { transaction_id: "TX_123", success: true, order_id: "...", amount_cents: 17000 }
  
  Your backend:
  1. Verifies HMAC signature (prevents fake webhooks)
  2. Checks referenceId "PAYMOB_TX_123" against wallet_transactions table
     → If already exists: return 200, stop (idempotency)
     → If new: proceed
  3. Marks the order as "payment authorized"
  4. Order proceeds with normal lifecycle (PENDING → ACCEPTED → ...)

Step 4 — Driver marks DELIVERED:
  Backend calls Paymob:
    POST /v1/transactions/{transaction_id}/capture
    { amount_cents: 17000 }
  Paymob moves the funds from customer's bank to platform's account
  Settlement then distributes to merchant and driver wallets

Step 5 — If order is CANCELLED/REJECTED:
  Backend calls Paymob:
    POST /v1/transactions/{transaction_id}/void
  Authorization released — no charge on customer's card
```

### The Webhook Idempotency Problem

Paymob (and all payment gateways) may fire the same webhook **more than once**. This happens when:
- Your server was slow to respond (gateway retries after timeout)
- Network issues caused a duplicate delivery
- Paymob's own systems had a retry loop

If you don't handle this, the customer gets credited twice, or the merchant gets paid twice.

**The fix — referenceId uniqueness:**

```typescript
// In your webhook handler:
async function handlePaymobWebhook(payload: PaymobWebhook) {
  const referenceId = `PAYMOB_TX_${payload.transaction_id}`;

  // Check if we already processed this exact transaction
  const existing = await walletTransactionRepo.findOne({
    where: { referenceId },
  });

  if (existing) {
    // Already processed — return 200 to stop Paymob retrying
    return { status: 200, message: 'Already processed' };
  }

  // Process for the first time
  await creditWallet({ userId, amount, referenceId });
}
```

The `idx_wallet_transactions_reference` unique index in Dawwar's database enforces this at the DB level — even if two webhook calls arrive simultaneously, only one INSERT will succeed. The second will throw a unique constraint violation, which you catch and return 200.

---

# 5. Commission & Settlement

## How Talabat's Commission Model Works

Talabat charges restaurants **15% to 30%** commission on each order. The exact percentage depends on:

- The restaurant's location (high-traffic areas pay more)
- Order volume (high-volume restaurants negotiate lower rates)
- Whether the restaurant uses Talabat's delivery fleet or their own

Talabat does NOT settle per-order. They aggregate all orders and settle with the restaurant on a **weekly or monthly cycle**, wiring the net amount to the restaurant's bank account.

## How Dawwar Should Do It (Per-Order, Wallet-Based)

Dawwar's wallet system is far superior to Talabat's batch settlement for a small platform. Every order completion immediately credits the merchant's and driver's wallets. They see the money instantly. This is a competitive advantage.

### The Settlement Math

```
Example order:
  subtotal    = 150 EGP  (what customer pays for food)
  deliveryFee = 25  EGP  (what customer pays for delivery)
  tipAmount   = 10  EGP  (optional tip to driver)
  discount    = 20  EGP  (promo code applied)
  total       = 165 EGP  (subtotal + deliveryFee + tip - discount)

Platform configuration:
  merchantCommissionRate = 15%
  driverCommissionFlat   = 5 EGP (or a percentage)

Settlement calculation:
  merchantCommission  = subtotal × 0.15 = 22.50 EGP
  merchantCredit      = subtotal - merchantCommission = 127.50 EGP

  driverCommission    = 5 EGP (flat)
  driverCredit        = deliveryFee + tipAmount - driverCommission
                      = 25 + 10 - 5 = 30 EGP

  platformRevenue     = merchantCommission + driverCommission
                      = 22.50 + 5 = 27.50 EGP

  Verification (WALLET order):
  customerDebit = 165 EGP
  merchantCredit + driverCredit = 127.50 + 30 = 157.50 EGP
  platformRevenue = 165 - 157.50 = 7.50 EGP
  
  Wait — doesn't match 27.50?
  The discount (20 EGP) was platform-funded (promo code).
  Platform net = 27.50 (gross commission) - 20 (promo cost) = 7.50 EGP ✓
```

### The Wallet Transaction Chain

For every completed order, these records are inserted into `WalletTransactionEntity`:

| # | walletId | type | reason | amount | referenceId |
|---|---|---|---|---|---|
| 1 | customer's wallet | DEBIT | ORDER_PAYMENT | 165.00 | `ORDER_PAY_ORD-12345` |
| 2 | merchant's wallet | CREDIT | ORDER_PAYMENT | 127.50 | `MERCHANT_ORD-12345` |
| 3 | merchant's wallet | DEBIT | COMMISSION_DEDUCTION | 22.50 | `COMM_MERCH_ORD-12345` |
| 4 | driver's wallet | CREDIT | DELIVERY_FEE | 25.00 | `DRIVER_FEE_ORD-12345` |
| 5 | driver's wallet | CREDIT | TIP | 10.00 | `DRIVER_TIP_ORD-12345` |
| 6 | driver's wallet | DEBIT | COMMISSION_DEDUCTION | 5.00 | `COMM_DRIVER_ORD-12345` |

Every record has `balanceBefore` and `balanceAfter`. The chain can be fully reconstructed from these records. This is your audit trail.

### Commission Should NEVER Come From the Client

```typescript
// ❌ WRONG — trusting the client
// Frontend sends: { subtotal: 150, commission: 5 }  ← anyone can change this
const commission = req.body.commission;

// ✅ CORRECT — calculated server-side only
const merchant = await merchantRepo.findOne({ id: order.merchantId });
const commission = order.subtotal * (merchant.commissionRate / 100);
// The client never touches this number
```

---

# 6. The Real-Time Layer

## How Talabat & Mrsool Handle Real-Time

Both platforms use a combination of two technologies:

| Technology | When Used | Latency | Works When App Is |
|---|---|---|---|
| WebSockets (Socket.IO) | Active order in foreground | < 100ms | Open / Foreground |
| FCM Push Notification | Any status change | 1-5 seconds | Background / Closed |

This dual approach is mandatory. You cannot rely only on sockets (app might be in background) and you cannot rely only on push (no real-time location updates, too slow for tracking).

## The Room Architecture

```
Socket rooms used during an order:

customer:{customerId}  ← personal room for customer, always joined on auth
merchant:{merchantId}  ← personal room for merchant, always joined on auth
driver:{driverId}      ← personal room for driver, always joined on auth
order:{orderId}        ← shared room for an active order

When order is placed:
  → customer joins order:{orderId}

When driver is assigned:
  → driver joins order:{orderId}

Events emitted to order:{orderId}:
  → ORDER_STATUS_CHANGED (all status transitions after PENDING)
  → DRIVER_LOCATION (every 2 seconds while driver is active)

Events emitted to merchant:{merchantId}:
  → ORDER_STATUS_CHANGED (PENDING) ← new order arrives here

Events emitted to customer:{customerId}:
  → ORDER_STATUS_CHANGED (REJECTED, CANCELLED) ← personal alerts

When order reaches COMPLETED or CANCELLED:
  → All parties leave order:{orderId}
```

## Driver Location — The Throttle Rule

Talabat's driver app emits location every **2 seconds**. This is a deliberate choice:

- Faster (1s) = smoother map animation, but doubles server load
- Slower (5s) = driver icon jumps on map, bad UX
- 2 seconds = the sweet spot for smooth animation without server strain

The throttle is enforced **on the server** (gateway level), not just the client. Even if a buggy driver app sends updates every 100ms, the server only forwards once per 2 seconds to the customer's room.

```typescript
// In AppGateway — server-side throttle
private locationThrottle = new Map<string, number>(); // driverId → lastEmitTimestamp

handleDriverLocationUpdate(socket, payload) {
  const now = Date.now();
  const lastEmit = this.locationThrottle.get(socket.userId) ?? 0;

  if (now - lastEmit < 2000) {
    return; // throttled — drop this update
  }

  this.locationThrottle.set(socket.userId, now);
  this.server.to(`order:${payload.orderId}`).emit('DRIVER_LOCATION', {
    orderId: payload.orderId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    heading: payload.heading,
  });
}
```

---

# 7. How to Apply All of This to Dawwar

## Mapping Talabat/Mrsool Concepts to Dawwar's Codebase

| Concept | Talabat/Mrsool | Dawwar Implementation |
|---|---|---|
| Order state machine | 7 stages | `OrderEntity.status` + `OrderEvent` records |
| Real-time updates | Socket.IO rooms | `AppGateway` + `order:{id}` rooms |
| Background notifications | FCM | Firebase + `FIREBASE_SENDER_ID` |
| Payment gateway | Local gateway (Mada, Network Int'l) | Paymob |
| Wallet system | In-app credit | `WalletEntity` + `WalletTransactionEntity` |
| Idempotency | Internal dedup logic | `referenceId` unique constraint |
| Commission deduction | Server-side percentage | `merchantCommissionRate` on `MerchantEntity` |
| Driver assignment | Dispatch algorithm | BullMQ job triggered on `READY` |
| Throttled location | 2s server-side | `locationThrottle` Map in gateway |
| Atomic settlement | DB transaction | TypeORM `DataSource.transaction()` |

## The Correct Order to Implement

Work in this sequence. Each step builds on the previous.

```
Step 1 — State machine is correct (backend)
  → All status transitions validated
  → Invalid transitions return 400
  → OrderEvent inserted on every transition
  → ORDER_STATUS_CHANGED emitted on every transition

Step 2 — Socket rooms working
  → Customer joins order:{id} when order placed
  → Merchant joins merchant:{id} on auth
  → Driver joins order:{id} when assigned
  → All apps receive ORDER_STATUS_CHANGED in real time

Step 3 — Payment methods work
  → CASH: order completes, merchant and driver wallets credited
  → WALLET: balance check → debit on placement → credit on completion
  → ONLINE: Paymob webhook → authorization → capture on delivery

Step 4 — Commission math is correct
  → merchantCommission calculated server-side
  → driverCommission calculated server-side
  → WalletTransactionEntity records created with all referenceIds

Step 5 — Idempotency tested
  → Duplicate Paymob webhook → no double credit
  → Duplicate order placement request → no double order
  → Concurrent wallet updates → no balance corruption (pessimistic lock)

Step 6 — Notifications working
  → FCM fires when app is in background for all status changes
  → Socket fires when app is in foreground for all status changes
  → Driver location appears on customer map in real time
```

## The Three Most Important Rules

### Rule 1: Money Never Moves Without a Status Transition

Never write code that moves wallet money without also updating order status and inserting an OrderEvent. They must always travel together in the same database transaction.

```typescript
// ✅ CORRECT — status + money in one transaction
await dataSource.transaction(async (manager) => {
  // 1. Update order status
  await manager.update(OrderEntity, orderId, { status: 'COMPLETED' });

  // 2. Insert OrderEvent
  await manager.insert(OrderEvent, { orderId, status: 'COMPLETED' });

  // 3. Move money
  await creditWallet(manager, merchantId, merchantCredit, referenceId);
  await creditWallet(manager, driverId, driverCredit, referenceId);
});
```

### Rule 2: Every Wallet Mutation Has a referenceId

No exceptions. The format should be descriptive and unique:

```
ORDER_PAY_ORD-12345        ← customer debit for order
MERCHANT_ORD-12345         ← merchant credit
COMM_MERCH_ORD-12345       ← merchant commission deduction
DRIVER_FEE_ORD-12345       ← driver delivery fee credit
DRIVER_TIP_ORD-12345       ← driver tip credit
COMM_DRIVER_ORD-12345      ← driver commission deduction
REFUND_ORD-12345           ← refund on cancellation/rejection
PAYMOB_TX_123456           ← Paymob webhook credit (wallet recharge)
WITHDRAWAL_USR-789_001     ← driver/merchant withdrawal
```

### Rule 3: Settlement Is Atomic or It Doesn't Happen

If the merchant credit fails, roll back the driver credit. If any part of the settlement fails, the order should stay in `DELIVERED` state (not `COMPLETED`) and alert the admin. Never leave money in a partially distributed state.

```typescript
try {
  await dataSource.transaction(async (manager) => {
    await creditMerchant(manager, ...);
    await creditDriver(manager, ...);
    await updateOrderStatus(manager, 'COMPLETED');
    // If any of these throw, the entire transaction rolls back
  });
} catch (error) {
  // Order stays in DELIVERED
  // Alert admin via notification or monitoring (Sentry)
  await alertAdmin(`Settlement failed for order ${orderNumber}: ${error.message}`);
}
```

---

# 8. Common Mistakes

## Mistake 1: Emitting Socket Events Outside the Transaction

```typescript
// ❌ WRONG — socket fires even if DB transaction fails
await updateOrderStatus('COMPLETED');
this.gateway.emit('ORDER_STATUS_CHANGED', { status: 'COMPLETED' }); // fires regardless
await creditWallet(); // this might fail — but client already saw COMPLETED

// ✅ CORRECT — socket fires only after transaction commits
await dataSource.transaction(async (manager) => {
  await updateOrderStatus(manager, 'COMPLETED');
  await creditWallet(manager, ...);
  // transaction commits here
});
// Only emit after successful commit
this.gateway.emit('ORDER_STATUS_CHANGED', { status: 'COMPLETED' });
```

## Mistake 2: Early Return Before Socket Room Join

```typescript
// ❌ WRONG — guard before room join
if (!order) return null;
socket.join(`order:${orderId}`); // never runs if order is null initially

// ✅ CORRECT — room join in useEffect, guard inside
useEffect(() => {
  if (!orderId || !socket) return;
  socket.emit('join', { room: `order:${orderId}` });
  return () => socket.emit('leave', { room: `order:${orderId}` });
}, [orderId, socket]);
```

## Mistake 3: Trusting the Client for Financial Calculations

```typescript
// ❌ WRONG — accepting total from client
const { total, deliveryFee, discount } = req.body; // anyone can send 0

// ✅ CORRECT — recalculate everything server-side
const items = await productRepo.findByIds(req.body.itemIds);
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const deliveryFee = calculateDeliveryFee(merchantLocation, customerLocation);
const discount = await validateAndApplyPromo(req.body.promoCode, subtotal);
const total = subtotal + deliveryFee - discount;
```

## Mistake 4: No Timeout on Driver Assignment

```typescript
// ❌ WRONG — driver can sit on an assignment forever
socket.emit('NEW_ASSIGNMENT', orderDetails);
// wait... and wait... order is stuck

// ✅ CORRECT — 30-second timeout, then move to next driver
const assignment = await assignToDriver(driverId, orderId);
setTimeout(async () => {
  const order = await orderRepo.findOne(orderId);
  if (order.status === 'READY') { // still not accepted
    await assignToNextDriver(orderId, excludeDriverId: driverId);
  }
}, 30_000);
```

## Mistake 5: Processing Paymob Webhooks Without Signature Verification

```typescript
// ❌ WRONG — anyone can hit this endpoint
app.post('/payments/webhook', (req, res) => {
  creditWallet(req.body.amount); // never do this
});

// ✅ CORRECT — verify HMAC before processing
app.post('/payments/webhook', (req, res) => {
  const hmac = req.headers['hmac'];
  const expected = crypto
    .createHmac('sha512', process.env.PAYMOB_HMAC_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hmac !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Now safe to process
  processWebhook(req.body);
});
```

---

## Summary — The Mental Model

Think of Dawwar as a **pipe that money flows through**:

```
Customer pays 165 EGP
        │
        ▼
Platform holds it temporarily
        │
        ├──► Merchant gets 127.50 EGP  (food they made)
        ├──► Driver gets 30.00 EGP     (delivery they did)
        └──► Platform keeps 7.50 EGP   (service fee)

Total distributed: 127.50 + 30.00 + 7.50 = 165 EGP ✓
```

The order flow is the **pipe**. The sockets and push notifications are the **gauges on the pipe** that tell everyone what's happening inside. The payment system is the **valve** that controls when money flows and how much goes where.

Build the pipe first (order status machine). Then add the gauges (real-time events). Then add the valve (payment settlement). In that order. Never the other way around.
# Payment & Wallet System - Dawwar

## Wallet Infrastructure
The wallet system acts as a primary ledger for all actors in the ecosystem.

### Safety Mechanisms
1. **Pessimistic Write Locking:** Prevents race conditions during balance updates.
2. **Atomic Settlement:** Order completion triggers multiple wallet moves (Customer -> Merchant, Customer -> Driver) in a single DB transaction.
3. **Balance Snapshots:** Every transaction records `balanceBefore` and `balanceAfter` to allow for full historical reconstruction.

## Paymob Integration
Paymob is the primary payment provider for online transactions in Egypt.

### Flows
1. **Recharge:** 
   - Frontend initiates recharge.
   - Backend creates a Paymob order and returns the `paymentToken`.
   - Webhook updates the Dawwar Wallet upon success.
2. **Online Checkout:** 
   - Total amount is held/authorized via Paymob.
   - Settled upon order delivery.

## Commission Logic
- **Merchant Commission:** Flat percentage or EGP fee deducted automatically from the subtotal before merchant credit.
- **Driver Commission:** Platform fee deducted from the delivery fee.
- **Calculations:** Done on the server side; never trusted from the client request.

## Idempotency
All financial mutations require a `referenceId` (e.g., `PAYMOB_TX_123` or `ORDER_PAY_ORD-001`). This ensures that retrying a failed request or duplicate webhooks never results in double charging or crediting.

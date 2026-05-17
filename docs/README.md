# Dawwar — Complete Project Brain
### Master Documentation Index · All decisions, all files, all remaining work

> This file is the single entry point for understanding the entire Dawwar platform. Read this first. Every section links to the detailed file that covers it. Kept up to date as new docs are produced.

---

## Quick Stats

| Metric | Value |
|---|---|
| Apps | 4 (Customer · Driver · Merchant · Admin) |
| Backend | NestJS v10 · PostgreSQL · TypeORM · Socket.IO · Redis · BullMQ |
| Mobile stack | React Native 0.84 · Redux Toolkit · TanStack Query · MMKV · Socket.IO |
| Monorepo | Turborepo · pnpm workspaces |
| Payment gateway | Paymob (Egypt) |
| OTP provider | Akedly / VerifyNow |
| Maps | Google Maps (tracking) · OSM Nominatim (geocoding) |
| Push notifications | Firebase Cloud Messaging (FCM) |
| Primary language | Arabic (RTL-first) |
| Design brand | Green (#1DB954) · Cairo font |
| Market | All Egypt (not restricted to one city) |

---

## Documentation Files — What's in Each

### Architecture & Strategy

| File | What it covers |
|---|---|
| `docs/architecture/system-overview.md` | General system architecture and data flow. |
| `docs/architecture/talabat-mrsool-dawwar-flow.md` | Full order & payment flow guide (Talabat/Mrsool model). Commission, real-time layer, common mistakes. |
| `docs/architecture/categories-guest-cart.md` | Parent/child category hierarchy, Guest mode, Anonymous cart (MMKV survives login), and Login gate modal. |
| `docs/architecture/egypt-discovery-delivery-fee-design.md` | Egypt-wide discovery, distance-based delivery fee formula, and Green design system tokens. |

### Application Documentation

| File | What it covers |
|---|---|
| `docs/apps/customer-app.md` | Customer application architecture, features, and setup. |
| `docs/apps/merchant-app.md` | Merchant application architecture, feature modules, and authentication flows. |
| `docs/apps/merchant-standards.md` | Engineering standards for the Merchant app: Reactotron, Profile gates, Icons, i18n, and Memoization rules. |

---

## System Architecture — One Page Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DAWWAR PLATFORM                             │
├──────────────┬──────────────┬──────────────┬───────────────────────┤
│ Customer App │  Driver App  │ Merchant App │    Admin Dashboard    │
│ React Native │ React Native │ React Native │       Next.js         │
├──────────────┴──────────────┴──────────────┴───────────────────────┤
│                    packages/ (shared)                               │
│  types · api-client · ui · theme · i18n · utils · config           │
├─────────────────────────────────────────────────────────────────────┤
│                    backend/ (NestJS)                                │
│  Auth · Users · Merchants · Products · Orders · Wallet · Payouts   │
│  Gateway (Socket.IO) · Upload (S3) · Categories · Banners          │
├──────────┬──────────────┬─────────────┬────────────────────────────┤
│ PostgreSQL│    Redis     │  Paymob     │  Firebase FCM · Akedly    │
└──────────┴──────────────┴─────────────┴────────────────────────────┘
```

## Order Flow — Summary

```
Customer places order (POST /orders)
  → Merchant receives via socket (merchant:{id} room) + FCM
  → Merchant accepts + sets prep time
  → Merchant marks READY
  → Backend assigns nearest available driver (BullMQ job)
  → Driver receives assignment via socket (driver:{id} room) + FCM
  → Driver emits location every 2s → customer map updates
  → Driver picks up → PICKED_UP
  → Driver delivers → DELIVERED
  → Atomic settlement: customer debited, merchant credited (−commission), driver credited (−commission)
  → COMPLETED
```

## Money Flow — Summary

```
Customer pays 165 EGP (WALLET order)
  Customer wallet: −165 EGP
  Merchant wallet: +127.50 EGP  (subtotal 150 × 85% after 15% commission)
  Driver wallet:   +28 EGP      (deliveryFee 25 + tip 10 − 7 commission)
  Platform keeps:  +9.50 EGP   (commission total)
  ─────────────────────────────
  165 = 127.50 + 28 + 9.50 ✓
```

## Delivery Fee Formula

```
BASE_FEE    = 15 EGP
RATE_PER_KM =  3 EGP/km
LONG_SURCHARGE = 10 EGP (applied when distance > 7km)
MAX_DISTANCE   = 30 km
```

## Design System — Quick Reference

```
Primary green:    #1DB954
Dark green:       #17A348
Light green tint: #E8F8EF
Font:             Cairo (Arabic) · Inter (English)
Border radius:    Cards=16 · Buttons=14 · Chips=24 · Inputs=12
```

---

## TypeScript — Non-Negotiable Rules

```typescript
// 1. No 'as any' anywhere
// 2. All navigation hooks typed with ParamList
// 3. All Redux selectors use typed useAppSelector
// 4. All API hooks have explicit return types from packages/types
// 5. All component props have interfaces
// 6. All enums from packages/types (OrderStatus, PaymentMethod, etc.)
// 7. Optional chaining on all nullable data
```

## Financial — Non-Negotiable Rules

```
1. Money never moves without a status transition (same DB transaction)
2. Every wallet mutation has a unique referenceId
3. Commission calculated server-side only — never trusted from client
4. All settlement in one atomic TypeORM transaction
5. Socket events emitted only AFTER transaction commits
6. Paymob webhooks: verify HMAC before any processing
7. Pessimistic lock on wallet before any credit/debit
```

## RTL — Non-Negotiable Rules

```
1. marginStart / marginEnd (never marginLeft / marginRight)
2. paddingStart / paddingEnd (never paddingLeft / paddingRight)
3. textAlign: 'auto' (never hardcoded 'right' or 'left')
4. Chevron/arrow icons: scaleX: I18nManager.isRTL ? -1 : 1
5. No hardcoded flexDirection: 'row-reverse'
```

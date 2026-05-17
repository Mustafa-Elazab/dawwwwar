# Database Schema - Dawwar

The Dawwar database is built on **PostgreSQL**, managed via **TypeORM**.

## Core Models

### `UserEntity`
- `id`: UUID (Primary Key)
- `phone`: Unique Egyptian number.
- `name`: Full name.
- `role`: `ADMIN`, `DRIVER`, `MERCHANT`, `CUSTOMER`.
- `isApproved`: Boolean (Compliance check).

### `OrderEntity`
- `id`: UUID.
- `orderNumber`: Unique readable ID (e.g., ORD-12345).
- `customerId`, `merchantId`, `driverId`: Foreign Keys.
- `status`: `PENDING`, `ACCEPTED`, `READY`, `ASSIGNED`, `PICKED_UP`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `REJECTED`.
- `total`, `subtotal`, `deliveryFee`, `discount`, `tipAmount`: Financial decimals.
- `paymentMethod`: `CASH`, `WALLET`, `ONLINE`.

### `WalletEntity`
- `userId`: Link to `UserEntity`.
- `balance`: Current available funds.
- `pendingWithdrawal`: Reserved for active payout requests.

### `WalletTransactionEntity` (Ledger)
- `walletId`: Link to `WalletEntity`.
- `type`: `CREDIT` or `DEBIT`.
- `reason`: `ORDER_PAYMENT`, `WALLET_RECHARGE`, `DELIVERY_FEE`, `TIP`, `WITHDRAWAL`, `COMMISSION_DEDUCTION`.
- `balanceBefore`, `balanceAfter`: Snapshots for auditing.
- `referenceId`: Unique constraint for idempotency.

### `MerchantEntity`
- `userId`: Link to store owner.
- `businessName`: Name of the outlet.
- `isOpen`: Boolean.
- `latitude`, `longitude`: Geospatial location.

## Key Relationships
1. **User (1) <-> (1) Wallet:** Every user gets a wallet upon registration.
2. **Merchant (1) <-> (n) Product:** Stores manage their menu.
3. **Order (1) <-> (n) OrderItem:** Line items in the checkout.
4. **Order (1) <-> (n) OrderEvent:** Detailed history for tracking timeline.

## Indexes
- `idx_orders_driver_status`: Composite index for assignment performance.
- `idx_merchants_location`: For efficient proximity search.
- `idx_wallet_transactions_reference`: Enforces ledger idempotency.

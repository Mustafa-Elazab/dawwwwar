# Backend Documentation - NestJS API

## Architecture
The backend is built with **NestJS**, following a modular architecture. Each feature is encapsulated in a module containing its own controller, service, and data access logic.

## Core Stack
- **NestJS v10:** Progressive Node.js framework.
- **TypeORM:** SQL ORM with PostgreSQL.
- **Socket.IO:** WebSocket implementation for real-time updates.
- **BullMQ:** Redis-based queue for background jobs.
- **Swagger:** API documentation available at `/docs`.

## Modules Overview
1. **Auth:** Handles JWT generation, phone verification (Akedly), and role-based access.
2. **Users:** Profile management and FCM token registration.
3. **Merchants:** Merchant registration, availability, and profile.
4. **Products:** Product catalog management.
5. **Orders:** Core logistics logic, state transitions, and assignment.
6. **Wallet:** Financial ledger system with atomic transactions and locking.
7. **Payouts:** Withdrawal requests and automated settlements.
8. **Gateway:** Centralized WebSocket hub for order updates and tracking.
9. **Upload:** S3-compatible file upload system (direct and presigned).

## Security & Authorization
- **Guards:**
  - `JwtAuthGuard`: Ensures the request has a valid JWT.
  - `RolesGuard`: Restricts endpoints to specific roles (ADMIN, DRIVER, MERCHANT, CUSTOMER).
- **Interceptors:**
  - `LoggingInterceptor`: Logs request duration and status.
  - `TransformInterceptor`: Ensures consistent response shapes.

## Financial Integrity (The Wallet Ledger)
Wallet mutations are handled via `creditWallet` and `debitWallet` methods which:
1. Use **Pessimistic Locking** on the wallet record.
2. Require a **referenceId** for idempotency.
3. Perform all operations within a single database transaction.
4. Log every movement in the `WalletTransactionEntity`.

## Sockets & Real-time
The `AppGateway` manages connections and rooms:
- `order:{id}`: Used for real-time order status and tracking.
- `merchant:{id}`: Used for incoming order notifications for merchants.
- `customer:{id}`: Personal notifications.

Driver location updates are **throttled** at the gateway level (2s interval) to prevent server flooding.

## Database (Prisma was used earlier, but we migrated to TypeORM for better transaction control)
- **Entities:** Located in `src/database/entities`.
- **Migrations:** Managed via TypeORM CLI.
- **Transactions:** Handled via `DataSource` or `EntityManager`.

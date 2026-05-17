# System Overview - Dawwar Platform

## What is Dawwar?
Dawwar is a production-grade, Arabic-first hyperlocal delivery platform (Talabat/Mrsool style) designed for the Egyptian market. It connects customers with local merchants and drivers to facilitate the delivery of food, groceries, pharmacy items, and custom orders from any location.

## Business Model
Dawwar operates on a commission-based model:
- **Merchants:** Pay a commission on each order processed through the platform.
- **Drivers:** Earn delivery fees and tips, with a platform fee deducted from their earnings.
- **Customers:** Pay for products and a distance-based delivery fee.

## Logistics Flow
1. **Order Placement:** Customer browses merchants or creates a custom order.
2. **Merchant Acceptance:** Merchant accepts the order and provides an estimated preparation time.
3. **Driver Assignment:** The system matches the order with the nearest available driver.
4. **Order Fulfillment:**
   - Driver arrives at the merchant.
   - Merchant hands over the order.
   - Driver delivers the order to the customer's location.
5. **Completion:** Driver marks the order as delivered; payments are settled across wallets.

## System Architecture
Dawwar is built as a **Turborepo Monorepo**, ensuring code sharing and consistency across different platforms.

### Monorepo Structure
- `/apps`: Contains the main applications (Customer, Driver, Merchant, Admin).
- `/packages`: Contains shared logic, UI components, types, and configurations.
- `/backend`: A centralized NestJS API serving all applications.

### Apps Overview
- **Customer App:** React Native app for end-users to browse and order.
- **Driver App:** React Native app for delivery partners to manage tasks and tracking.
- **Merchant App:** React Native app for store owners to manage products and orders.
- **Admin Dashboard:** Next.js web application for platform management.

### Backend Overview
The backend is a **NestJS** application utilizing:
- **TypeORM:** For database interactions with PostgreSQL.
- **Socket.IO:** For real-time order tracking and chat.
- **Redlock:** For distributed locking to ensure financial integrity.
- **Redis:** For caching and queue management.

## Request Lifecycle
1. **Frontend:** Dispatches an action (Redux) or trigger a hook (React Query).
2. **API Client:** Shared package handles the HTTP request to the backend.
3. **Guard/Interceptor:** Backend validates JWT, roles, and logs the request.
4. **Service:** Executes business logic and interacts with the database via TypeORM.
5. **Response:** Typed response is returned to the frontend.

## Socket Lifecycle
- **Connection:** Client authenticates with a JWT upon socket connection.
- **Rooms:** Users join rooms based on their ID, merchant ID, or active order ID.
- **Events:** Drivers broadcast location updates; customers and merchants receive status changes in real-time.

## Payment Lifecycle
- **Wallet:** Every user (Customer, Merchant, Driver) has a wallet in EGP.
- **Paymob:** Integration for online payments (Credit Card, Wallet).
- **Settlement:** Upon order completion, funds are atomically moved between wallets (Customer -> Merchant/Driver) with commission deductions.

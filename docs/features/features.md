# Feature Inventory - Dawwar Platform

## 1. Authentication & Onboarding
- **Flow:** Phone -> OTP -> Profile.
- **Backend:** `AuthModule` + Akedly for Egyptian phone numbers.
- **State:** Redux `auth` slice.

## 2. Dynamic Discovery
- **Banners:** Promotion carousel on HomeScreen.
- **Nearby Merchants:** GPS-based store discovery.
- **Categories:** Taxonomy of available services.
- **Search:** Instant store/product search.

## 3. The Menu & Cart
- **Merchant Details:** Sticky horizontal categories synced with menu scroll.
- **Cart Management:** Redux-based cart with MMKV persistence.
- **Merchant Conflict:** Automatically handles adding items from different stores (clears current cart after user confirmation).

## 4. Ordering System
- **Checkout:** Finalize address, payment method, and driver instructions.
- **Idempotency:** Backend uses reference keys to prevent double orders.
- **Order Events:** Real-time state machine for order lifecycle (PENDING -> ACCEPTED -> ... -> COMPLETED).

## 5. Real-time Tracking
- **WebSockets:** Live location updates from Driver to Customer.
- **MapView:** Interactive map with motor icon.
- **Socket Throttling:** 2s interval to ensure smooth map performance without server strain.

## 6. Financial Ledger (Wallet)
- **Balance:** Real-time wallet monitoring.
- **Recharge:** Paymob integration for balance top-up.
- **Ledger:** Detailed transaction history with balance before/after for every movement.
- **Transactions:** Grouped by day (Today, Yesterday).

## 7. Delivery Locations
- **Saved Places:** Quick access to Home/Work labels.
- **Map Picker:** Geocoding via OSM Nominatim API.
- **RTL-Safe:** Search input and icons mirrored correctly.

## 8. Notifications
- **In-App:** Real-time toasts via Socket.IO.
- **Push:** Firebase Cloud Messaging (FCM) for background alerts.
- **Badge:** Visual dots for unread alerts.

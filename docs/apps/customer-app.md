# Customer App Documentation

## Navigation Structure
Dawwar Customer uses **React Navigation v6** with a root stack and nested tab navigator.

### Root Navigator
- **AuthStack:** Splash, Login, OTP, Complete Profile.
- **CustomerTabs:** The main tab-based experience.
- **Modals:** (Overlaying everything)
  - CartModal
  - CheckoutModal
  - CustomOrderModal

### Tab Navigator (CustomerTabs)
1. **HomeTab:** HomeStack (HomeScreen, Search, CategoryMerchants, NearbyMerchants, PopularProducts, MerchantDetails, Tracking, LocationPicker).
2. **CategoriesTab:** CategoriesScreen.
3. **OrdersTab:** OrdersStack (OrdersList, Tracking).
4. **ProfileTab:** ProfileStack (Profile, Addresses, Wallet, Notifications).

## State Management
- **Redux Toolkit:** Used for global client-side state:
  - `auth`: User session and tokens.
  - `cart`: Persisted shopping cart (MMKV).
  - `location`: Current and saved delivery locations.
  - `ui`: Global UI states.
- **TanStack Query (React Query):** Used for server-side state:
  - Automatic caching.
  - Background refetching.
  - Mutation handling.

## Key Flows

### Auth Flow
- **Phone Login:** Uses Akedly/VerifyNow for WhatsApp/SMS OTP.
- **Restore Session:** `restoreSession` in `AppProviders` checks MMKV for tokens on boot.

### Checkout Flow
1. **Cart:** Global floating toast or Modal.
2. **Address Selection:** Choose from saved or map.
3. **Payment:** Choose Cash or Wallet.
4. **Order Placement:** Triggers `placeOrder` mutation and redirects to Tracking.

### Real-time Tracking
- **Socket.IO:** App listens for `DRIVER_LOCATION` events when in the Tracking screen.
- **MapView:** Shows driver icon moving towards the customer destination.

### Wallet System
- **Recharge:** Integrates Paymob for balance topping.
- **Transactions:** Grouped by date (Today/Yesterday) with ledger detail.

## Localization System
- **RTL-First:** Arabic is the default direction.
- **Logical Properties:** Uses `marginStart`, `paddingEnd` instead of `Left/Right`.
- **Dynamic Switching:** Real-time language toggle with immediate RTL mirroring.

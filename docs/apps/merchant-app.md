# Dawwar Merchant App Architecture & Documentation

## Full Merchant App Architecture

The Dawwar Merchant App is a standalone, production-grade application built with React Native. It exclusively serves the `MERCHANT` role, allowing business owners to onboard, manage products, track orders, and view analytics. The architecture follows a strict separation of concerns, heavily utilizing the monorepo's shared packages (`@dawwar/theme`, `@dawwar/ui`, `@dawwar/i18n`, `@dawwar/api-client`, and `@dawwar/types`) to ensure absolute consistency with the Customer and Driver apps.

### Core Architecture Principles:
- **Standalone Runtime:** No dynamic role-selection branching at runtime. The app assumes the Merchant context implicitly.
- **Fail-Safe Initialization:** The app is wrapped in a robust initialization sequence protecting against white screens, guaranteeing localization (`i18next`), persistence (`MMKV`), and native splash (`react-native-bootsplash`) resolve deterministically before rendering the navigation stack.
- **Type Safety:** 100% Strict TypeScript compliance.

## Folder Structure

```
apps/merchant/
├── android/                 # Native Android build configurations
├── ios/                     # Native iOS build configurations
├── src/
│   ├── app/                 # Entrypoint components (App.tsx, providers.tsx)
│   ├── components/          # Reusable, app-specific UI components (e.g., RTLTextInput)
│   ├── core/                # Core configurations, MMKV storage, API interceptors
│   ├── features/            # Domain-driven feature modules
│   │   ├── analytics/       # Analytics dashboard screens
│   │   ├── auth/            # Authentication screens (Phone, OTP, Registration)
│   │   ├── orders/          # Order management and tracking
│   │   ├── products/        # Product listing, adding, and editing
│   │   └── profile/         # Merchant profile and settings
│   ├── hooks/               # App-wide custom hooks
│   ├── navigation/          # React Navigation stacks and config
│   ├── store/               # Redux Toolkit store and slices
│   └── utils/               # Helpers (e.g., notifications, phone validation)
├── index.js                 # React Native entry point
├── package.json             # App dependencies
└── react-native.config.js   # Autolinking configuration
```

## Navigation Flow

The navigation strictly manages authentication, onboarding, and operational states based on the Redux `auth.slice`:

- **Splash Screen (`JS_SplashScreen`)**: Renders immediately during the session restore phase while `isLoading` is true. Native `RNBootSplash.hide()` is called once the container mounts.
- **AuthStack (`AuthNavigator`)**: For unauthenticated users.
  - `PhoneScreen` → `OtpScreen`.
  - On successful OTP, the stack is completely reset to prevent back-navigation anomalies.
- **Onboarding (`CreateStoreScreen`)**: Forced if the authenticated user lacks an associated merchant profile (`hasStore === false`).
- **ApprovalStack (`ApprovalNavigator`)**: For merchants awaiting admin approval.
  - `PendingApprovalScreen` → For pending reviews.
  - `RejectedScreen` → For declined applications.
- **Main App (`MerchantTabs`)**: The core authenticated experience.
  - `OrdersTab`
  - `ProductsTab`
  - `AnalyticsTab`
  - `ProfileTab`

## State Management

- **Redux Toolkit**: Manages global UI state and Auth state.
  - `auth.slice.ts`: Maintains `user`, `token`, `isAuthenticated`, `isLoading`, `isApproved`, `isRejected`, and `hasStore`.
  - `merchant.slice.ts`: Manages operational state like `newOrderCount`.
- **React Query (@tanstack/react-query)**: Manages remote server state, caching, background refetching, and API mutations.
- **MMKV**: Hyper-fast, synchronous local storage for theme preferences, session tokens, and i18n configurations.

## API Integrations

- **`@dawwar/api-client`**: A shared Axios-based API client.
- It dynamically assigns the `Authorization` header utilizing tokens from MMKV.
- Built-in interceptors safely dispatch a `logout` action to the Redux store upon HTTP 401 Unauthorized responses.
- Queries and mutations are strongly typed based on DTOs from `@dawwar/types`.

## Packages Used & Why

- **`react-native-bootsplash`**: For a seamless transition from the native OS boot screen to the React Native JS runtime.
- **`react-native-maps`**: Used during store creation to pinpoint the business location safely via geocoding.
- **`@react-native-firebase/messaging`**: Implements modular, reliable push notifications for order alerts.
- **`react-native-mmkv`**: For synchronous, high-performance local storage (crucial for initial app boot).
- **`react-navigation/native` & `stack` & `bottom-tabs`**: The industry standard for robust routing.
- **`react-hook-form` & `zod`**: For complex form management and validation (e.g., adding a product).

## Screens List

1. `JS_SplashScreen`
2. `PhoneScreen`
3. `OtpScreen`
4. `CreateStoreScreen`
5. `PendingApprovalScreen`
6. `RejectedScreen`
7. `MerchantOrdersScreen`
8. `ProductsScreen`
9. `AddEditProductScreen`
10. `AnalyticsScreen`
11. `MerchantProfileScreen`

## Feature List

- **Authentication**: Phone + OTP validation, Sandbox mode.
- **Store Creation**: Map-based address selection and category assignment.
- **Approval System**: Secure gateway preventing unauthorized access until admin review.
- **Order Management**: Real-time push notifications for new orders, status tracking.
- **Catalog Management**: Add, edit, and categorize products.
- **Business Analytics**: Visual breakdown of sales and performance.

## Localization System

- Driven by `i18next` and `@dawwar/i18n`.
- Uses `compatibilityJSON: 'v3'` for broad Android compatibility without requiring Intl polyfills.
- Supports English (`en`) and Arabic (`ar`).
- **RTL Support**: Managed natively via `I18nManager`. The app automatically restarts via `react-native-restart` if the layout direction changes.
- UI exclusively relies on `start/end` flex properties instead of `left/right`.

## Notification System

- Powered by `@react-native-firebase/messaging`.
- Implements modular API usage for `getToken`, `requestPermission`, `onMessage`, and `onNotificationOpenedApp`.
- Foreground notifications trigger custom sounds and in-app alerts (via `react-native-toast-message` and `Alert`).
- Automatically routes the merchant directly to an order details view if a notification is tapped.

## Authentication Flow

1. **Session Check**: App attempts to read `ACCESS_TOKEN` from MMKV.
2. **API Verification**: Calls `/auth/me` to validate token and fetch the profile.
3. **Store Verification**: Calls `/merchants/my` to determine if a store profile exists.
4. **Phone Input**: User inputs an Egyptian phone number.
5. **OTP Verification**: Verifies the code. On success, the stack resets.
6. **Redirection**: Depending on `hasStore` and `isApproved` / `isRejected`, the user is directed to the onboarding screen, the pending screen, or the main dashboard.

## Build/Run Instructions

**Prerequisites:**
- Node.js 18+
- pnpm v9+
- Android Studio / Xcode

**Install Dependencies:**
```bash
pnpm install
```

**Run Metro Bundler:**
```bash
pnpm --filter merchant start
```

**Run Android:**
```bash
pnpm --filter merchant android
# OR from inside apps/merchant/android:
./gradlew clean && ./gradlew assembleDebug
```

**Type Checking:**
```bash
pnpm --filter merchant type-check
```

## Known Edge Cases Handled

- **Infinite White Screen Freeze**: Eliminated by properly invoking `RNBootSplash.hide()` upon `NavigationContainer` completion, combined with a `Promise.race` timeout fallback for `setI18nConfig`.
- **Duplicate Navigation Screens**: Eliminated using `CommonActions.reset` after OTP validation to prevent hardware-back anomalies.
- **Native Maps Crash (`RNMapsAirModule`)**: Fixed by accurately linking `react-native-maps` inside the dynamic Android `react-native.config.js` and rebuilding the native binary.
- **React Native 0.84 Animation Crash**: Handled by setting `enableScreens(false)` to prevent duplicate Animated node IDs under the New Architecture.

## Performance Optimizations Applied

- **Memoization**: Heavy styles are wrapped in `React.useMemo` preventing layout recalculations during re-renders.
- **Synchronous Boot**: MMKV is used instead of AsyncStorage to ensure the app Theme and Language can be determined synchronously before the first React commit.
- **Inline Requires**: Enabled inside `metro.config.js` to defer module evaluation until execution time, speeding up the initial JS bundle execution.

## Remaining TODOs

- E2E Testing using Maestro.
- Integration of live sockets for real-time order dashboard updates (once backend implementation stabilizes).
- Finalize the iOS build configurations and test push notification entitlements in Xcode.
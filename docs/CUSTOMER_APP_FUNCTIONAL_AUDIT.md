# Customer App Functional Audit

Date: 2026-05-25

## Summary

Customer navigation was audited from the bottom tabs outward. The main functional issue was that the Categories tab mounted a single screen directly instead of a stack, so category detail navigation had no owning navigator. Orders also had no chat route, and several Figma-rebuilt screens still rendered static demo cards instead of using their existing controllers.

The customer app now type-checks and the tab/root route graph is stable.

## What Was Broken

- `apps/customer/src/navigation/CustomerTabs.tsx`
  - `CategoriesTab` used `CategoriesScreen` directly, so `CategoryMerchantsScreen` could not be pushed inside the tab.
  - Tab hiding did not account for category deep screens.

- `apps/customer/src/navigation/types.ts`
  - No `CategoriesStackParamList`.
  - No chat route in `OrdersStackParamList`.
  - Category params required `categoryName`, even though callers may only have `categoryId`.

- `apps/customer/src/features/categories/screens/CategoriesScreen`
  - Screen was a static Figma shell and navigated with a demo `burger` id.

- `apps/customer/src/features/categories/screens/CategoryMerchantsScreen`
  - Screen was a static Figma shell and navigated with a demo merchant id.
  - Missing safe empty behavior when `categoryId` is absent.

- `apps/customer/src/features/orders/screens/OrdersListScreen`
  - Screen was a static Figma shell and did not use the existing orders controller.
  - Login navigation was typed as an orders-stack route.

- `apps/customer/src/features/orders/screens/TrackingScreen`
  - Screen rendered static order data and had no chat navigation.

- `apps/customer/src/features/custom-order/screens/CustomOrderScreen/useController.ts`
  - Success navigation tried to navigate directly to `TrackingScreen` from a root modal, which can produce an unhandled navigation action.

- `apps/customer/src/features/profile/screens/ProfileScreen`
  - Profile menu rows were static and did not navigate to registered profile screens.

## What Was Fixed

- Added a real categories stack:
  - `apps/customer/src/navigation/stacks/CategoriesStack.tsx`

- Updated route constants and param types:
  - `apps/customer/src/navigation/routes.ts`
  - `apps/customer/src/navigation/types.ts`

- Updated bottom tabs:
  - `apps/customer/src/navigation/CustomerTabs.tsx`
  - Tabs remain: Home, Categories, Orders, Profile
  - Category deep screens now hide the tab bar, same as Home/Orders/Profile deep screens.

- Wired category screens to real data and safe params:
  - `apps/customer/src/features/categories/screens/CategoriesScreen/index.tsx`
  - `apps/customer/src/features/categories/screens/CategoriesScreen/useController.ts`
  - `apps/customer/src/features/categories/screens/CategoryMerchantsScreen/index.tsx`
  - `apps/customer/src/features/categories/screens/CategoryMerchantsScreen/useController.ts`
  - `apps/customer/src/features/categories/core/api.ts`

- Wired orders list and tracking:
  - `apps/customer/src/features/orders/screens/OrdersListScreen/index.tsx`
  - `apps/customer/src/features/orders/screens/OrdersListScreen/useController.ts`
  - `apps/customer/src/features/orders/screens/TrackingScreen/index.tsx`
  - `apps/customer/src/features/orders/screens/TrackingScreen/useController.ts`
  - `apps/customer/src/features/chat/screens/OrderChatScreen/index.tsx`

- Fixed modal-to-orders success routing:
  - `apps/customer/src/features/custom-order/screens/CustomOrderScreen/useController.ts`

- Wired profile menu navigation:
  - `apps/customer/src/features/profile/screens/ProfileScreen/index.tsx`

- Added missing customer-facing translation keys used by the newly wired screens:
  - `packages/i18n/src/locales/en.json`
  - `packages/i18n/src/locales/ar.json`

## Current Navigation Map

### Root

- `CustomerTabs`
- `Auth`
- `CompleteProfile`
- `CartModal`
- `CheckoutModal`
- `CustomOrderModal`

### Bottom Tabs

- `HomeTab`
  - Stack: `HomeStack`
  - Screens:
    - `HomeScreen`
    - `SearchScreen`
    - `CategoryMerchantsScreen`
    - `MerchantDetailScreen`
    - `LocationPickerScreen`
    - `NearbyMerchantsScreen`
    - `PopularProductsScreen`
    - `NotificationsScreen`

- `CategoriesTab`
  - Stack: `CategoriesStack`
  - Screens:
    - `CategoriesScreen`
    - `CategoryMerchantsScreen`
    - `MerchantDetailScreen`

- `OrdersTab`
  - Stack: `OrdersStack`
  - Screens:
    - `OrdersListScreen`
    - `OrderDetailScreen`
    - `TrackingScreen`
    - `OrderChatScreen`

- `ProfileTab`
  - Stack: `ProfileStack`
  - Screens:
    - `ProfileScreen`
    - `EditProfileScreen`
    - `AddressesScreen`
    - `AddAddressScreen`
    - `LanguageScreen`
    - `AppearanceScreen`
    - `TermsScreen`
    - `PrivacyScreen`
    - `WalletScreen`
    - `TransactionsScreen`
    - `NotificationsScreen`

## Flow Status

- Tabs: Functional.
- Categories: Functional list -> category merchants -> merchant details.
- Orders: Functional list -> detail/tracking -> chat.
- Profile: Functional menu routes for edit profile, wallet, notifications, language, appearance, terms, and privacy.
- Custom order success: Routes through `CustomerTabs -> OrdersTab -> TrackingScreen`.
- Localization: Customer static key audit has no missing EN/AR keys.
- RTL/LTR: App waits for i18n initialization before rendering navigation; language switching uses the centralized `updateLanguage` / RTL manager path.

## Figma Tabs Check

Tabs in app:

- Home
- Categories
- Orders
- Profile

Tabs found in the local Figma-driven UI mapping:

- The local `FigmaTabBar` is generic and currently configured by `CustomerTabs.tsx` with the four app tabs above.
- Search and Offers appear as Home flow sections/actions, not required bottom tabs for current flow completeness.

Future tabs:

- Favorites
- Offers
- Search

No extra placeholder tabs were added because these are not required to complete the currently defined customer flows.

## Remaining Missing Screens

None for the required customer app scope. The required profile destinations exist and are registered:

- Edit Profile
- Wallet
- Notifications
- Language
- Terms
- Privacy

## Validation

Passed:

- `pnpm --filter @dawwar/customer type-check`

Localization scan:

- Customer translation keys used: `179`
- Missing in English: `0`
- Missing in Arabic: `0`
- Remaining customer `t('key', 'fallback')` calls: `0`

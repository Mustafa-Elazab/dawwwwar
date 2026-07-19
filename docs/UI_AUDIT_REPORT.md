# Customer UI Audit Report

Audit target: `apps/customer/src/**/*.ts` and `apps/customer/src/**/*.tsx`.

## Summary

- Customer files scanned: 244
- Screen entry files found: 31
- Raw React Native primitive hits in TSX: 675
- Inline style object hits: 23
- Customer `StyleSheet.create` files: 61
- Screen entry files missing a UI template wrapper: 1
- Primary blocker for a pixel-close Figma rebuild: final Figma PNGs are not yet mapped for every Customer screen.

## Global Violations

- Several feature-level components still duplicate UI package responsibilities: local merchant cards, product cards, category cards, order cards, tab bars, map cards, profile rows, and cart bars.
- Some screens still keep large JSX bodies in `index.tsx`, especially Home, Checkout, Merchant Details, Custom Order, Tracking, and direct profile/payment screens.
- Raw React Native primitives are still common in customer UI. These should be replaced during the screen rebuild with `packages/ui` atoms, molecules, organisms, and templates.
- Non-P0 screens still include single-file screen implementations, including payment, invite friends, edit profile, terms, privacy, and cancel order flows.
- `OrderChatScreen` is the only current `index.tsx` screen entry found without a template wrapper.
- Many visual components lack explicit `testID` props on primary actions, rows, search, tab controls, cart CTA, and order actions.

## Per-Feature Report

### Auth

Audited:

- `apps/customer/src/features/auth/screens/SplashScreen`
- `apps/customer/src/features/auth/screens/OnboardingScreen`
- `apps/customer/src/features/auth/screens/PhoneScreen`
- `apps/customer/src/features/auth/screens/OtpScreen`
- `apps/customer/src/features/auth/screens/CompleteProfileScreen`

Status:

- Splash, onboarding, phone, and OTP now follow the controller/template/component split.
- `CompleteProfileScreen` still needs the same component split and Speedy Chow visual rebuild.
- OTP and phone use local presentational components, but should migrate to `OTPInputRow`, `AppInput`, `FormField`, and `AppButton` during the rebuild.

### Home, Categories, Merchant

Audited:

- `apps/customer/src/features/home/screens/HomeScreen`
- `apps/customer/src/features/home/screens/NearbyMerchantsScreen`
- `apps/customer/src/features/home/screens/PopularProductsScreen`
- `apps/customer/src/features/categories/screens/CategoriesScreen`
- `apps/customer/src/features/categories/screens/CategoryMerchantsScreen`
- `apps/customer/src/features/merchant/screens/MerchantDetailScreen`

Status:

- Category list and category merchant screens are structurally clean.
- Home still contains large presentation composition in `index.tsx`; it must move more sections to screen components and packages/ui organisms.
- Merchant details now renders through a template, but still has local product/category/header UI that should move to shared `MerchantCard`, `ProductCard`, `Tabs`, and `CategoryTile`.
- Local home cards should be replaced by `packages/ui` organism cards.

### Cart and Checkout

Audited:

- `apps/customer/src/features/cart/screens/CartModal`
- `apps/customer/src/features/checkout/screens/CheckoutScreen`

Status:

- Cart has a split content/footer structure and keeps business logic in `useController`.
- Checkout still has a large JSX tree and should be split into delivery address, payment method, notes, and summary components.
- Promo input and summary rows should use `AppInput`, `PriceRow`, and `FormField`.

### Orders, Tracking, Chat

Audited:

- `apps/customer/src/features/orders/screens/OrdersListScreen`
- `apps/customer/src/features/orders/screens/OrderDetailScreen`
- `apps/customer/src/features/orders/screens/TrackingScreen`
- `apps/customer/src/features/orders/screens/CancelOrderScreen`
- `apps/customer/src/features/chat/screens/OrderChatScreen`

Status:

- Orders list and order detail are structurally clean.
- Tracking and cancel order still need component extraction and shared UI replacements.
- `OrderChatScreen` must be wrapped in a template and split into controller/styles/components.
- Local `OrderCard` should be replaced by the shared `packages/ui` `OrderCard`.

### Profile, Wallet, Notifications

Audited:

- `apps/customer/src/features/profile/screens/ProfileScreen`
- `apps/customer/src/features/profile/screens/LanguageScreen`
- `apps/customer/src/features/profile/screens/*`
- `apps/customer/src/features/wallet/screens/*`
- `apps/customer/src/features/notifications/screens/NotificationsScreen`

Status:

- Profile, language, and notifications have the required folder structure.
- Payment methods, add payment, invite friends, edit profile, terms, and privacy are still single-file screens.
- Wallet screens need the same template/component split and shared `PriceRow`, `ListRow`, and `SegmentedControl` primitives.

### Location and Custom Order

Audited:

- `apps/customer/src/features/location/screens/LocationPickerScreen`
- `apps/customer/src/features/custom-order/screens/CustomOrderScreen`
- `apps/customer/src/features/custom-order/components/*`

Status:

- Location picker and custom order contain substantial local UI and raw primitives.
- Delivery location selection should use shared `LocationSelectorSheet`.
- Map picker UI still needs a template-aligned rebuild once the Figma PNG is mapped.

## Missing Shared UI Required For Figma Rebuild

Implemented or added in `packages/ui`:

- App-prefixed atoms: text, icon, pressable, image, divider, badge, chip, avatar, spinner, input, button, card.
- Molecules: app header, section header, list row, quantity stepper, price row, radio row, OTP input row, banner carousel, location pill.
- Organisms: merchant card, product card, category tile, order card, address card, payment method card, location selector sheet, floating cart CTA, tabs, segmented control, promo banner, profile header.
- Templates: app screen, scroll screen, list screen, modal sheet, header template.

Remaining during screen rebuild:

- Replace customer-local cards and rows with shared UI equivalents.
- Add deterministic `testID` props to primary flows.
- Finish single-file non-P0 screen conversion.
- Use final Figma PNGs to tune dimensions, spacing, imagery, and exact hierarchy.

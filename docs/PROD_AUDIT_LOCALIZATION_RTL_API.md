# Production Audit: Localization, RTL, and API Connectivity

Date: 2026-05-25

## Scope

Audited and stabilized the production-critical surfaces across:

- `apps/customer`
- `apps/driver`
- `apps/merchant`
- `apps/admin`
- `backend`
- `packages/api-client`
- `packages/i18n`
- `packages/ui`
- `packages/theme`

No product feature redesign was performed. Changes were limited to localization completion, direction correctness, endpoint alignment, DTO compatibility, and runtime response-shape fixes.

## Localization Status

### Audit Result

Translation usage was scanned across `apps` and `packages` for:

- `t('...')`
- `i18n.t('...')`
- legacy translation calls with hardcoded fallback strings

Final audit result:

- Keys used in code: `350`
- Missing in English: `0`
- Missing in Arabic: `0`
- English-only keys: `0`
- Arabic-only keys: `0`
- Remaining `t('key', 'fallback')` UI fallbacks: `0`

### Keys Added or Equalized

Added or equalized keys in both `packages/i18n/src/locales/en.json` and `packages/i18n/src/locales/ar.json`, including:

- `mainTabs.home`
- `mainTabs.categories`
- `mainTabs.orders`
- `mainTabs.profile`
- `auth.login`
- `auth.otp`
- `auth.resend`
- `auth.verify`
- `home.nearby`
- `home.offers`
- `home.popular`
- `home.seeAll`
- `home.chooseDeliveryLocation`
- `cart.*`
- `checkout.*`
- `tracking.*`
- `chat.*`
- `profile.*`
- `settings.*`
- `notifications.*`
- `driver.*`
- `merchant.*`
- `common.*`

### Hardcoded UI Text Replaced

Removed translation fallback literals in customer, driver, and merchant UI/controller code. Navigation labels, tab labels, button text, empty states, error text, and relevant screen labels now resolve through i18n keys.

### Remaining Localization Blocker

`apps/admin` still uses hardcoded English UI text broadly and does not yet have the same i18n wiring pattern as the React Native apps. API auth correctness was improved for admin session restore, but full admin localization requires adding or wiring a web i18n provider before replacing page text safely.

## RTL/LTR Status

### Central RTL Handling

RTL switching is centralized in:

- `packages/i18n/src/rtl.manager.ts`
- `packages/i18n/src/localization.manager.ts`

Behavior:

- Arabic calls `I18nManager.forceRTL(true)`
- English calls `I18nManager.forceRTL(false)`
- App restart is triggered only when the native RTL state actually changes
- Language persistence remains managed through the existing localization storage path

### Shared UI Direction Fixes

Updated shared UI primitives and reusable UI styles to avoid physical left/right alignment:

- `packages/ui/src/atoms/Text/index.tsx`
- `packages/ui/src/atoms/Text/styles.ts`
- `packages/ui/src/atoms/Input/styles.ts`
- `packages/ui/src/molecules/Header/styles.ts`
- `packages/ui/src/molecules/SearchBar/styles.ts`
- `packages/ui/src/molecules/DeviceGuidance/styles.ts`
- `packages/ui/src/organisms/Header/styles.ts`
- `packages/ui/src/organisms/ImageGallery/styles.ts`
- `packages/ui/src/organisms/RatingBar/styles.ts`
- `packages/ui/src/organisms/Chat/components/MessageBubble.tsx`

Applied:

- `textAlign: 'auto'`
- `writingDirection: 'auto'`
- `marginStart` / `marginEnd`
- `paddingStart` / `paddingEnd`
- logical `start` / `end` where absolute directional placement is intended

### Navigation Direction

Customer, driver, and merchant tab labels now use localization keys. Customer tabs keep RTL-aware order mirroring through the tab implementation. Shared headers and text primitives now default to automatic text direction.

### Manual RTL Exceptions Still Present

Some screen-specific physical positioning remains intentionally outside this stabilization pass because it is absolute geometry, map positioning, centered pins, image overlays, or deeply legacy screen layout that needs visual QA rather than mechanical replacement:

- Map picker pins and full-screen overlays
- Merchant detail image/header overlays
- Global cart floating overlays
- Some legacy phone/OTP input decoration offsets
- Badge offsets in app-specific tab bars

These are not hidden; they should be handled with targeted visual RTL QA per screen.

## API Connectivity Status

### Base URL Strategy

React Native API clients now use a single runtime strategy:

- Android emulator: `http://10.0.2.2:3000/api/v1`
- iOS simulator: `http://localhost:3000/api/v1`
- Physical device: `http://<LOCAL_IP>:3000/api/v1`
- Production: requires `API_BASE_URL` / `API_URL`; no fallback to `https://api.dawwar.com`

Admin remains:

- `NEXT_PUBLIC_API_URL || http://localhost:3000`
- API client appends `/api/v1`

Production socket clients now require an explicit socket URL instead of silently falling back to a hardcoded production host.

### Response Shape

The API client interceptor no longer unwraps backend `{ success, data }` responses globally. This keeps `packages/api-client` service return types aligned with backend contracts and prevents inconsistent runtime behavior.

Direct app API calls that require domain data were adjusted where they were found in critical flows, including delivery-fee preview and checkout fee calculation.

### Endpoint Alignment Fixed

Customer:

- `POST /auth/customer/verify-otp`
- `GET /categories`
- `GET /merchants/nearby`
- `GET /merchants/:id`
- `GET /merchants/:id/products`
- `GET /products/featured`
- `GET /orders/my`
- `POST /orders`
- `POST /orders/custom`
- `GET /orders/:id`
- `GET /orders/delivery-fee`
- `GET /wallet`
- `GET /wallet/transactions`
- `POST /wallet/recharge`

Driver:

- `POST /auth/driver/verify-otp`
- `GET /orders/driver/available`
- `GET /orders/driver/active`
- `POST /orders/driver/:id/accept`
- `POST /orders/driver/:id/decline`
- `PATCH /orders/driver/:id/status`
- `POST /orders/driver/:id/shopping-photos`
- `POST /driver/online`
- `PATCH /driver/location`
- `POST /driver/location`
- `GET /driver/earnings`
- `GET /driver/wallet`
- `GET /wallet/transactions`

Merchant:

- `POST /auth/merchant/verify-otp`
- `GET /merchants/my`
- `POST /merchants`
- `PATCH /merchants/:id`
- `GET /orders/merchant/all`
- `POST /orders/merchant/:id/accept`
- `POST /orders/merchant/:id/reject`
- `POST /orders/merchant/:id/ready`
- `GET /products`
- `POST /products`
- `PATCH /products/:id`
- `DELETE /products/:id`

Admin:

- `GET /auth/me`
- `GET /admin/merchants`
- `PATCH /admin/merchants/:id/approve`
- `PATCH /admin/merchants/:id/reject`
- `GET /admin/orders`
- `POST /admin/orders/:id/cancel`
- `GET /admin/drivers`
- `PATCH /admin/drivers/:id/approve`
- `PATCH /admin/drivers/:id/offline`
- `GET /admin/customers`
- `GET /admin/promo`
- `GET /analytics/platform`

### DTO and Backend Compatibility Fixes

Fixed `GET /merchants/nearby?lat=&lng=` 400s:

- Added `lat` / `lng` aliases
- Empty values transform to `undefined`
- Numeric query params are transformed before validation
- Controller normalizes aliases into `latitude` / `longitude`

Fixed `POST /orders` and `POST /orders/custom` 400s for valid free-delivery cases:

- `deliveryFee` now accepts `0` with `@Min(0)`
- Numeric transformation is preserved

Fixed auth response mismatch:

- Backend OTP verify returns `isFirstLogin`, matching app and API-client usage

Fixed missing role selection contract:

- Added `POST /auth/select-role`
- Added API-client service and hook

Fixed admin session restore:

- Added `GET /auth/me`
- Admin auth hook reads wrapped `data.data`

Fixed driver native background sync compatibility:

- Added `POST /driver/location` alongside existing `PATCH /driver/location`

Fixed driver shopping photo route:

- Added `POST /orders/driver/:id/shopping-photos`
- Driver app now calls the backend route that exists

### Remaining API Blockers

Admin login still calls `POST /auth/login` with `{ phone, password }`, but backend auth is OTP-based and has no password column or login service. This should not be papered over with a fake password endpoint. The production-safe fix is to either wire admin to the existing admin OTP flow or formally add password auth with schema, hashing, seed/update flow, and security review.

`packages/api-client/src/realtime/socket-manager.ts` no longer hardcodes localhost, but consumers that import the singleton directly must initialize it with the app socket URL before use.

## Validation

Passed:

- `pnpm --filter @dawwar/customer type-check`
- `pnpm --filter @dawwar/driver type-check`
- `pnpm --filter @dawwar/merchant type-check`
- `pnpm --filter @dawwar/admin type-check`
- `pnpm --filter @dawwar/api-client type-check`
- `pnpm --filter @dawwar/ui type-check`
- `pnpm --filter @dawwar/theme type-check`
- `pnpm --filter @dawwar/i18n type-check`
- `pnpm --filter @dawwar/backend type-check`

Localization audit passed:

- Missing English keys: `0`
- Missing Arabic keys: `0`
- English-only keys: `0`
- Arabic-only keys: `0`
- Translation fallback literals: `0`

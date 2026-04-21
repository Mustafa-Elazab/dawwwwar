# Dawwar (دوّار) — Hyperlocal Delivery Platform

> Phase 1: Mock Data Build · React Native 0.84 · Monorepo

Dawwar is a hyperlocal delivery platform built for Sinbellawin, Egypt.
Three separate React Native apps share a common design system and mock data layer.

---

## Apps

| App | Bundle ID | Users |
|-----|-----------|-------|
| `apps/customer` | `com.dawwarcustomer` | Customers placing orders |
| `apps/driver` | `com.dawwardriver` | Drivers delivering orders |
| `apps/merchant` | `com.dawwarmerchant` | Merchants managing shop |

---

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm 9.15+
- Java 17 (for Android builds)
- Android Studio with emulator API 30+

```bash
# Install all dependencies
pnpm install

# Start customer app
cd apps/customer
npx react-native run-android

# Start driver app (new terminal)
cd apps/driver
npx react-native run-android

# Start merchant app (new terminal)
cd apps/merchant
npx react-native run-android
```

---

## Monorepo Structure

```
dawwar/
├── apps/
│   ├── customer/          Customer ordering app
│   ├── driver/            Driver delivery app
│   └── merchant/          Merchant management app
├── packages/
│   ├── types/             Shared TypeScript types (@dawwar/types)
│   ├── theme/             Design tokens + ThemeProvider (@dawwar/theme)
│   ├── i18n/              Arabic/English translations (@dawwar/i18n)
│   ├── mocks/             Mock DB + API handlers (@dawwar/mocks)
│   └── ui/                Component library (@dawwar/ui)
├── .npmrc                 pnpm hoisting config
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Sandbox Credentials

All test users use OTP code `123456`.

| Role | Phone | Notes |
|------|-------|-------|
| Customer | `01011111111` | 200 EGP wallet |
| Customer | `01022222222` | 50 EGP wallet |
| Merchant | `01033333333` | Grocery shop, open |
| Merchant | `01044444444` | Restaurant, open |
| Merchant | `01055555555` | Pharmacy, **closed** |
| Driver | `01066666666` | Approved, use this for driver app |
| Driver | `01077777777` | Approved, low balance |
| Pending Merchant | `01088888888` | Not yet approved |
| Pending Driver | `01099999999` | Not yet approved |
| Admin | `01000000000` | Admin role |

---

## Shared Packages

### `@dawwar/types` 
All TypeScript enums, interfaces, and API response types shared across all apps.
Source-only — no build step needed.

### `@dawwar/theme` 
Design token system: colors (light + dark), typography, spacing, shadows.
`ThemeProvider` persists theme choice via MMKV.
`useTheme()` hook provides `colors`, `typography`, `space`, `shadows`, `isDark`, `setMode`.

### `@dawwar/i18n` 
Arabic (default) and English translations for all 3 apps.
RTL switching requires app restart (via `react-native-restart`).
OTP sandbox note embedded in `ar.json` and `en.json`.

### `@dawwar/mocks` 
Mock database: 10 users, 3 merchants, 19 products, 5 orders, 7 wallets.
Every mock function adds `await delay(800)` for realistic UX.
All mock handlers match the real API signature exactly — Phase 2 replaces only the body.

### `@dawwar/ui` 
Atomic design component library:
- **Atoms:** Text, Button, Input, Icon, Badge, Avatar, Skeleton, Divider, Chip
- **Molecules:** SearchBar, ListItem, Card, EmptyState, ErrorState, LoadingSpinner, NetworkBanner, StepIndicator
- **Organisms:** Header, BottomSheet, ImageGallery, RatingBar, FormField
- **Templates:** ScreenTemplate, ScrollScreenTemplate, ListScreenTemplate, TabScreenTemplate

---

## Feature Module Structure

Every feature in every app follows this exact pattern:

```
feature-name/
├── components/          Feature-specific components only
│   └── ComponentName/
│       ├── index.tsx
│       ├── styles.ts    createStyles(colors) factory — never static StyleSheet
│       └── types.ts
├── core/
│   ├── api.ts           Mock in Phase 1, real Axios in Phase 2
│   ├── entity.ts        Re-exports from @dawwar/types
│   ├── response.ts      API response shapes
│   └── hooks.ts         React Query useQuery/useMutation hooks
├── hooks/               Feature-specific business logic hooks
├── navigation/
│   └── route.ts         Re-exports from app's navigation/routes.ts
├── screens/
│   └── ScreenName/
│       ├── index.tsx    Thin layout only — calls useController()
│       ├── styles.ts    createStyles(colors) factory
│       ├── types.ts     Navigation prop types
│       └── useController.ts  ALL business logic
└── utils/               Pure helper functions
```

---

## Screen Rules (enforced in all 3 apps)

Every screen must:
1. Use a template: `ScreenTemplate`, `ScrollScreenTemplate`, `ListScreenTemplate`, or `TabScreenTemplate` 
2. Have `index.tsx` call `useController()` — layout only, no logic in JSX
3. Handle loading state (Skeleton or LoadingSpinner)
4. Handle error state (ErrorState + retry)
5. Handle empty state (EmptyState with icon)
6. Use `t()` for all user-visible strings — zero hardcoded text
7. Use `createStyles(colors)` for all styles — zero inline styles
8. Use `I18nManager.isRTL` for direction — zero hardcoded `left`/`right` 

---

## Phase 2 Migration Guide

Switching from mock to real backend:

1. Set `USE_MOCK_API=false` in `.env.staging` or `.env.production` 
2. Ensure NestJS backend is running at `API_BASE_URL` 
3. Each `feature/core/api.ts` already has both `realApi` and `mockApi` implementations
4. No screen, hook, or component changes needed

The Phase 2 API contract (endpoints, request/response shapes) is documented in each `core/api.ts` file's `realApi` object.

Socket.io real-time features (order status updates, driver location) are stubbed in `core/socket/socket.ts` with Phase 2 code commented in each file.

---

## Architecture Decisions

| Decision | Reason |
|----------|--------|
| pnpm + `node-linker=hoisted` | Metro bundler requires hoisted node_modules for native module resolution |
| Turborepo 2.x with `"tasks"` | `"pipeline"` key removed in v2, breaking silently if not updated |
| `tsconfig.base.json` with `"moduleResolution": "Bundler"` | RN 0.84 default; `"node16"` causes false errors with RN imports |
| MMKV over AsyncStorage | ~10× faster, synchronous reads for auth token in interceptors |
| Separate MMKV IDs per app | `dawwar-customer`, `dawwar-driver`, `dawwar-merchant` — no cross-app data |
| Direct imports in templates | Avoids Metro circular barrel resolution bug (`ScreenTemplate undefined`) |
| `createStyles(colors)` factory | Enables live theme switching without component remount |
| `useController()` pattern | Keeps JSX thin, business logic testable, screen files readable |

---

## Known Limitations (Phase 1)

- Voice recording uses `@react-native-voice/voice` — produces mock URI in sandbox
- Photo upload stores local URI — no real S3 upload
- Map reverse geocoding returns coordinate string — no real geocoder
- Order alert sound requires a real `.mp3` in `res/raw/` — placeholder in Phase 1
- Socket.io is a no-op stub — order/driver status updates are polled every 10–15s
- Driver location movement is simulated with ±0.0005° random offset per 5s

---

## Test Users Summary

Quick reference for manual testing sessions:

```
Customer flow:    01011111111 (200 EGP wallet, 2 addresses)
Driver flow:      01066666666 (approved, 50 EGP wallet)
Merchant flow:    01033333333 (grocery, open, 8 products)
Pending state:    01088888888 (merchant) or 01099999999 (driver)
```

---

## Git Tags

| Tag | Description |
|-----|-------------|
| `v1.0.0-phase1-mock` | Phase 1 complete — all mock data, all 3 apps |

---

## License

Private — Dawwar © 2024

# Dawwar Customer App — Overview

> **Version:** 1.0.0 (MVP Phase 1)
> **Stack:** React Native 0.84 · New Architecture (Fabric) · TypeScript · Redux Toolkit · TanStack Query · i18next · pnpm Monorepo

---

## App Description

Dawwar (دوّار) is a **hyperlocal delivery platform** serving **Sinbellawin, Dakahlia Governorate, Egypt** — similar in concept to Mrsool. Customers can:

- Browse nearby shops and their product menus
- Add items to a cart and check out
- Request a **custom order** (order anything from any shop, even without a menu) by describing what they need in text, voice, or photos
- Track their order through a live-status timeline
- Manage their wallet (in-app balance)
- Switch the UI language between Arabic and English

The platform is designed for the Egyptian market: RTL support, Egyptian phone validation, EGP currency, and six-form Arabic plurals.

---

## User Roles

| Role | Can do | Approval required |
|------|--------|-------------------|
| **Customer** | Browse, order, track, manage wallet | No |
| **Driver** | Accept delivery jobs, navigate, confirm delivery | Yes — admin approves |
| **Merchant** | Receive orders, manage menu, view analytics | Yes — admin approves |
| **Admin** | Full access (backend dashboard, not in this app) | N/A |

This repo contains only the **Customer** mobile app.

---

## Main Features

### Phase 1 (current — MVP with mocked backend)
- ✅ Auth: phone → OTP → role selection
- ✅ Browse nearby merchants
- ✅ View merchant products
- ✅ Add to cart (single-merchant enforcement)
- ✅ Checkout with cash or wallet payment
- ✅ Custom order flow (text + voice + photos)
- ✅ Orders list (active / past tabs)
- ✅ Order tracking with timeline
- ✅ Wallet screen with balance
- ✅ Profile, addresses, language, appearance settings
- ✅ Offline network banner
- ✅ Dark/Light mode
- ✅ RTL Arabic support

---

## App Flow

```
App Launch
    │
    ▼
RootNavigator
    ├─ isLoading  ──► LoadingSpinner
    ├─ !isAuthenticated  ──► AuthNavigator
    │       ├── AuthSelectionScreen
    │       ├── LoginScreen
    │       ├── RegisterScreen
    │       ├── OtpScreen         (sandbox code: 123456)
    │       ├── RoleScreen
    │       └── PendingApprovalScreen
    │
    └─ isAuthenticated
            │
        CustomerTabs
            ├── HomeTab  →  HomeScreen → MerchantDetailScreen
            ├── CategoriesTab  →  CategoriesScreen
            ├── OrdersTab  →  OrdersListScreen → TrackingScreen
            ├── WalletTab  →  WalletScreen
            └── ProfileTab  →  ProfileScreen
        
        Modals (over tabs):
            ├── CartModal
            ├── CheckoutModal
            └── CustomOrderModal
```

**Sandbox OTP:** `123456`
**Pre-seeded phones:** `01011111111` (customer), `01066666666` (driver), `01033333333` (merchant)

---

## Screens List

### Auth

| Screen | Purpose | Navigation |
|--------|---------|------------|
| AuthSelectionScreen | Entry — choose login or register | → Login or Register |
| LoginScreen | Phone + password form | → OtpScreen (context: login) |
| RegisterScreen | Name + phone + password form | → OtpScreen (context: signup) |
| OtpScreen | 4-digit OTP, shake on error, auto-submit | → RoleScreen (first login) or CustomerTabs |
| RoleScreen | Pick Customer / Merchant / Driver | → CustomerTabs or PendingApproval |
| PendingApprovalScreen | Awaiting admin approval | Logout |
| PhoneScreen | Legacy OTP-first phone entry | → OtpScreen |

### Main App

| Screen | Purpose | Key Actions |
|--------|---------|-------------|
| HomeScreen | Nearby merchants + featured products feed | FAB → CustomOrderModal |
| MerchantDetailScreen | Merchant menu (3 tabs: menu/info/reviews) | Add to cart; sticky CartBar → CartModal |
| CategoriesScreen | 2-column category grid | → CategoryMerchantsScreen |
| CategoryMerchantsScreen | Merchants by category | → MerchantDetailScreen |
| OrdersListScreen | Active / Past tabs | → TrackingScreen |
| TrackingScreen | Status timeline + driver card | Cancel order (PENDING/ACCEPTED) |
| WalletScreen | Balance card + recharge chips | → TransactionsScreen |
| ProfileScreen | User info + settings rows | → sub-screens; Logout |
| CartModal | Cart items + summary | → CheckoutModal |
| CheckoutScreen | Address + payment + place order | Dispatches order → OrdersListScreen |
| CustomOrderScreen | Text/voice/photos + budget + payment | Places custom order |

---

## State Management

### Redux Slices

| Slice | State | Key Actions |
|-------|-------|-------------|
| `auth` | user, isAuthenticated, isLoading | setAuth, logout, finishLoading |
| `cart` | items[], merchantId | addItem, removeItem, updateQuantity, clearCart |
| `ui` | theme | setTheme |

Cart enforces **single-merchant rule** — adding from a different merchant clears the cart.

### React Query

All data fetching uses TanStack Query. Key query keys:
- `['home', 'nearby']` — nearby merchants
- `['home', 'featured']` — featured products
- `['orders', 'mine', userId]` — user orders (active/past derived)
- `['order', orderId]` — single order detail

---

## Mock Data System

All API calls route to mock handlers in `packages/mocks/` with realistic delays (400–1200ms).

**Pre-seeded data:**
- 10 users (customer, merchant, driver, pending, admin roles)
- Several merchants with opening hours
- Products linked to merchants
- Sample orders in various statuses
- Wallet balances per user

**Sandbox OTP code:** `123456` for all phone numbers.

---

## Package Architecture

```
dawwar/
├── apps/
│   └── customer/   ← This app
└── packages/
    ├── ui/         ← Shared design system (Text, Button, Input, Icon, Cards, Templates...)
    ├── theme/      ← Colors, typography tokens + ThemeProvider
    ├── i18n/       ← i18next setup + en/ar locale JSON files
    ├── mocks/      ← In-memory fake API handlers + database
    └── types/      ← Shared TypeScript interfaces
```

**Metro singleton pinning:** Native packages (react-native, reanimated, screens, gesture-handler, safe-area-context) are hard-pinned to `apps/customer/node_modules/` via Metro `resolveRequest` to prevent pnpm's virtual-store from bundling two physical copies, which would cause native renderer crashes.

---

## Bugs Fixed (This Session)

| # | Bug | Fix |
|---|-----|-----|
| 1 | `RCTText` Invariant Violation — view config undefined | Rewrote metro.config.js `resolveRequest` hook to correctly intercept bare module specifiers and prevent infinite recursion |
| 2 | `getPaperRenderer` crash (Cannot read 'default') on button press | Changed OTP shake animation to `useNativeDriver: false` — Paper renderer unavailable in Fabric mode |
| 3 | Login/Register navigated to OTP without calling `sendOtp` | Both controllers now call `sendOtpMutation.mutateAsync()` before navigating; show loading + server error state |
| 4 | OtpScreen back button was empty (no-op) | Added `useNavigation().goBack()` |
| 5 | PhoneScreen missing required `context` param when navigating to OTP | Added `context: 'login'` |
| 6 | Duplicate `nodeModulesPaths` block in metro config (leftover from bad edit) | Consolidated into one block |
| 7 | `Intl.PluralRules` i18next warning on Hermes | Added `supportedLngs` + `load: 'languageOnly'` to i18n config |

---

## Current Limitations

| Area | Status |
|------|--------|
| Backend | In-memory mocks only — no real server |
| OTP | No SMS delivery; sandbox code `123456` |
| Payments | Wallet balance is fake; no payment gateway |
| Real-time | `setInterval` simulates driver movement; no Socket.IO |
| Maps | Placeholder view; `react-native-maps` not wired up |
| Push Notifications | Firebase installed; FCM registration not implemented |
| Voice Recording | UI exists; actual recording not implemented |
| Search | Placeholder screen only |
| Chat | Not implemented |
| Reviews | "Coming soon" placeholder |

---

## Future Improvements

1. Wire all `core/api.ts` files to the real Axios client (remove mock imports)
2. OTP via SMS — backend integration with Twilio/Africa's Talking  
3. Socket.IO — real-time order status + driver location
4. `react-native-maps` integration for live tracking and address picking
5. Payment gateway — Fawry or Paymob
6. Push notifications (FCM token upload + notification handling)
7. Search — full-text across merchants and products
8. Reviews and ratings on completed orders
9. In-app chat per order
10. React Error Boundaries around each feature navigator
11. Detox E2E test suite for auth, order, and cart flows

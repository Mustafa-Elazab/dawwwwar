// ─── Auth Stack ──────────────────────────────────────────
export const AUTH_ROUTES = {
  PHONE: 'PhoneScreen',
  OTP: 'OtpScreen',
  ROLE: 'RoleScreen',
  CUSTOMER_ONBOARDING: 'CustomerOnboardingScreen',
  MERCHANT_ONBOARDING: 'MerchantOnboardingScreen',
  DRIVER_ONBOARDING: 'DriverOnboardingScreen',
  PENDING_APPROVAL: 'PendingApprovalScreen',
} as const;

// ─── Customer Tab Names ───────────────────────────────────
export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  CATEGORIES_TAB: 'CategoriesTab',
  ORDERS_TAB: 'OrdersTab',
  WALLET_TAB: 'WalletTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

// ─── Home Stack ───────────────────────────────────────────
export const HOME_ROUTES = {
  HOME: 'HomeScreen',
  SEARCH: 'SearchScreen',
  CATEGORY_MERCHANTS: 'CategoryMerchantsScreen',
  MERCHANT_DETAIL: 'MerchantDetailScreen',
} as const;

// ─── Orders Stack ─────────────────────────────────────────
export const ORDER_ROUTES = {
  ORDERS_LIST: 'OrdersListScreen',
  ORDER_DETAIL: 'OrderDetailScreen',
  TRACKING: 'TrackingScreen',
} as const;

// ─── Wallet Stack ─────────────────────────────────────────
export const WALLET_ROUTES = {
  WALLET: 'WalletScreen',
  TRANSACTIONS: 'TransactionsScreen',
} as const;

// ─── Profile Stack ────────────────────────────────────────
export const PROFILE_ROUTES = {
  PROFILE: 'ProfileScreen',
  ADDRESSES: 'AddressesScreen',
  ADD_ADDRESS: 'AddAddressScreen',
  LANGUAGE: 'LanguageScreen',
  APPEARANCE: 'AppearanceScreen',
} as const;

// ─── Modals (presented over tabs) ────────────────────────
export const MODAL_ROUTES = {
  CART: 'CartModal',
  CHECKOUT: 'CheckoutModal',
  CUSTOM_ORDER: 'CustomOrderModal',
} as const;

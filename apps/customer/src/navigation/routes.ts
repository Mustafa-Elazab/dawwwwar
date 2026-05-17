// ─── Auth Stack ──────────────────────────────────────────
export const AUTH_ROUTES = {
  SPLASH: 'SplashScreen',
  PHONE: 'PhoneScreen',
  OTP: 'OtpScreen',
  COMPLETE_PROFILE: 'CompleteProfileScreen',
} as const;

// ─── Customer Tab Names ───────────────────────────────────
export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  CATEGORIES_TAB: 'CategoriesTab',
  ORDERS_TAB: 'OrdersTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

// ─── Home Stack ───────────────────────────────────────────
export const HOME_ROUTES = {
  HOME: 'HomeScreen',
  SEARCH: 'SearchScreen',
  CATEGORY_MERCHANTS: 'CategoryMerchantsScreen',
  MERCHANT_DETAIL: 'MerchantDetailScreen',
  LOCATION_PICKER: 'LocationPickerScreen',
  NEARBY_MERCHANTS: 'NearbyMerchantsScreen',
  POPULAR_PRODUCTS: 'PopularProductsScreen',
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
  EDIT_PROFILE: 'EditProfileScreen',
  ADDRESSES: 'AddressesScreen',
  ADD_ADDRESS: 'AddAddressScreen',
  LANGUAGE: 'LanguageScreen',
  APPEARANCE: 'AppearanceScreen',
  TERMS: 'TermsScreen',
  PRIVACY: 'PrivacyScreen',
  NOTIFICATIONS: 'NotificationsScreen',
} as const;

// ─── Modals (presented over tabs) ────────────────────────
export const MODAL_ROUTES = {
  CART: 'CartModal',
  CHECKOUT: 'CheckoutModal',
  CUSTOM_ORDER: 'CustomOrderModal',
} as const;

// ─── Auth Stack ──────────────────────────────────────────
export const AUTH_ROUTES = {
  SPLASH: 'SplashScreen',
  ONBOARDING: 'OnboardingScreen',
  PHONE: 'PhoneScreen',
  OTP: 'OtpScreen',
  COMPLETE_PROFILE: 'CompleteProfileScreen',
} as const;

// ─── Customer Tab Names ───────────────────────────────────
export const TAB_ROUTES = {
  HOME_TAB: 'HomeTab',
  BASKET_TAB: 'BasketTab',
  ORDERS_TAB: 'OrdersTab',
  LIKED_TAB: 'LikedTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

// ─── Home Stack ───────────────────────────────────────────
export const HOME_ROUTES = {
  HOME: 'HomeScreen',
  CATEGORIES: 'CategoriesScreen',
  SEARCH: 'SearchScreen',
  CATEGORY_MERCHANTS: 'CategoryMerchantsScreen',
  MERCHANT_DETAIL: 'MerchantDetailScreen',
  PRODUCT_DETAIL: 'ProductDetailScreen',
  LOCATION_PICKER: 'LocationPickerScreen',
  NEARBY_MERCHANTS: 'NearbyMerchantsScreen',
  POPULAR_PRODUCTS: 'PopularProductsScreen',
} as const;

export const LIKED_ROUTES = {
  LIKED: 'LikedScreen',
} as const;

export const CATEGORY_ROUTES = {
  CATEGORIES: 'CategoriesScreen',
} as const;

// ─── Orders Stack ─────────────────────────────────────────
export const ORDER_ROUTES = {
  ORDERS_LIST: 'OrdersListScreen',
  ORDER_DETAIL: 'OrderDetailScreen',
  TRACKING: 'TrackingScreen',
  CANCEL_ORDER: 'CancelOrderScreen',
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
  PAYMENT_METHODS: 'PaymentMethodsScreen',
  ADD_PAYMENT_METHOD: 'AddPaymentMethodScreen',
  INVITE_FRIENDS: 'InviteFriendsScreen',
} as const;

// ─── Modals (presented over tabs) ────────────────────────
export const MODAL_ROUTES = {
  CHECKOUT: 'CheckoutModal',
  CUSTOM_ORDER: 'CustomOrderModal',
} as const;

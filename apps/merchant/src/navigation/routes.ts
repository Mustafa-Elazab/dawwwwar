export const AUTH_ROUTES = {
  PHONE: 'PhoneScreen', OTP: 'OtpScreen',
  PENDING: 'PendingApprovalScreen',
  REJECTED: 'RejectedScreen',
  CREATE_STORE: 'CreateStoreScreen',
} as const;

export const TAB_ROUTES = {
  ORDERS_TAB: 'OrdersTab',
  PRODUCTS_TAB: 'ProductsTab',
  ANALYTICS_TAB: 'AnalyticsTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

export const MERCHANT_ROUTES = {
  ORDERS: 'MerchantOrdersScreen',
  PRODUCTS: 'ProductsScreen',
  ADD_EDIT_PRODUCT: 'AddEditProductScreen',
  ANALYTICS: 'AnalyticsScreen',
  PROFILE: 'MerchantProfileScreen',
} as const;

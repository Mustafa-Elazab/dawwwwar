export const AUTH_ROUTES = {
  PHONE: 'PhoneScreen',
  OTP: 'OtpScreen',
  ROLE: 'RoleScreen',
  PENDING: 'PendingApprovalScreen',
} as const;

export const TAB_ROUTES = {
  AVAILABLE_ORDERS_TAB: 'AvailableOrdersTab',
  ACTIVE_DELIVERY_TAB: 'ActiveDeliveryTab',
  EARNINGS_TAB: 'EarningsTab',
  PROFILE_TAB: 'ProfileTab',
} as const;

export const DRIVER_ROUTES = {
  AVAILABLE_ORDERS: 'AvailableOrdersScreen',
  ACTIVE_DELIVERY: 'ActiveDeliveryScreen',
  COMPLETED_DELIVERY: 'CompletedDeliveryScreen',
  EARNINGS: 'EarningsScreen',
  PROFILE: 'DriverProfileScreen',
} as const;

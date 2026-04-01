import { createPlaceholder } from './PlaceholderScreen';
import { AUTH_ROUTES, DRIVER_ROUTES } from './routes';

// Auth (same as customer — shared logic, same mock)
export const PhoneScreen = createPlaceholder(AUTH_ROUTES.PHONE, 19);
export const OtpScreen = createPlaceholder(AUTH_ROUTES.OTP, 19);
export const RoleScreen = createPlaceholder(AUTH_ROUTES.ROLE, 19);
export const PendingApprovalScreen = createPlaceholder(AUTH_ROUTES.PENDING, 19);

// Driver screens — built in Tasks 20+
export const AvailableOrdersScreen = createPlaceholder(DRIVER_ROUTES.AVAILABLE_ORDERS, 20);
export const ActiveDeliveryScreen = createPlaceholder(DRIVER_ROUTES.ACTIVE_DELIVERY, 20);
export const CompletedDeliveryScreen = createPlaceholder(DRIVER_ROUTES.COMPLETED_DELIVERY, 20);
export const EarningsScreen = createPlaceholder(DRIVER_ROUTES.EARNINGS, 21);
export const DriverProfileScreen = createPlaceholder(DRIVER_ROUTES.PROFILE, 21);

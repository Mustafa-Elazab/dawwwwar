import { createPlaceholder } from './PlaceholderScreen';
import { AUTH_ROUTES, DRIVER_ROUTES } from './routes';

// Auth (same as customer — shared logic, same mock)
export { PhoneScreen } from '../features/auth/screens/PhoneScreen';
export { OtpScreen } from '../features/auth/screens/OtpScreen';
export { RoleScreen } from '../features/auth/screens/RoleScreen';
export { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';

// Driver screens — built in Tasks 20+
export { AvailableOrdersScreen } from '../features/available-orders/screens/AvailableOrdersScreen';
export const ActiveDeliveryScreen = createPlaceholder(DRIVER_ROUTES.ACTIVE_DELIVERY, 20);
export const CompletedDeliveryScreen = createPlaceholder(DRIVER_ROUTES.COMPLETED_DELIVERY, 20);
export const EarningsScreen = createPlaceholder(DRIVER_ROUTES.EARNINGS, 21);
export const DriverProfileScreen = createPlaceholder(DRIVER_ROUTES.PROFILE, 21);

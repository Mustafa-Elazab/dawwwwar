import { createPlaceholder } from './PlaceholderScreen';
import { AUTH_ROUTES, DRIVER_ROUTES } from './routes';

// Auth (same as customer — shared logic, same mock)
export { PhoneScreen } from '../features/auth/screens/PhoneScreen';
export { OtpScreen } from '../features/auth/screens/OtpScreen';
export { RoleScreen } from '../features/auth/screens/RoleScreen';
export { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';

// Driver screens — built in Tasks 20+
export { AvailableOrdersScreen } from '../features/available-orders/screens/AvailableOrdersScreen';
export { ActiveDeliveryScreen } from '../features/active-delivery/screens/ActiveDeliveryScreen';
export { CompletedDeliveryScreen } from '../features/active-delivery/screens/CompletedDeliveryScreen';
export { EarningsScreen } from '../features/earnings/screens/EarningsScreen';
export { DriverProfileScreen } from '../features/profile/screens/DriverProfileScreen';

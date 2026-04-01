import { createPlaceholder } from './PlaceholderScreen';
import {
  AUTH_ROUTES,
  HOME_ROUTES,
  ORDER_ROUTES,
  WALLET_ROUTES,
  PROFILE_ROUTES,
  MODAL_ROUTES,
} from './routes';

export { PhoneScreen } from '../features/auth/screens/PhoneScreen';
export { OtpScreen } from '../features/auth/screens/OtpScreen';
export { RoleScreen } from '../features/auth/screens/RoleScreen';
export { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';
export const CustomerOnboardingScreen = createPlaceholder(AUTH_ROUTES.CUSTOMER_ONBOARDING, 12);
export const MerchantOnboardingScreen = createPlaceholder(AUTH_ROUTES.MERCHANT_ONBOARDING, 12);
export const DriverOnboardingScreen = createPlaceholder(AUTH_ROUTES.DRIVER_ONBOARDING, 12);

// Home
export { HomeScreen } from '../features/home/screens/HomeScreen';
export const SearchScreen = createPlaceholder(HOME_ROUTES.SEARCH, 18);
export { CategoryMerchantsScreen } from '../features/categories/screens/CategoryMerchantsScreen';
export { MerchantDetailScreen } from '../features/merchant/screens/MerchantDetailScreen';

// Categories
export { CategoriesScreen } from '../features/categories/screens/CategoriesScreen';

// Orders
export { OrdersListScreen } from '../features/orders/screens/OrdersListScreen';
export { TrackingScreen as OrderDetailScreen } from '../features/orders/screens/TrackingScreen';
export { TrackingScreen } from '../features/orders/screens/TrackingScreen';

// Wallet
export { WalletScreen } from '../features/wallet/screens/WalletScreen';
export { TransactionsScreen } from '../features/wallet/screens/TransactionsScreen';

// Profile
export { ProfileScreen } from '../features/profile/screens/ProfileScreen';
export { AddressesScreen } from '../features/profile/screens/AddressesScreen';
export { AddAddressScreen } from '../features/profile/screens/AddAddressScreen';
export { LanguageScreen } from '../features/profile/screens/LanguageScreen';
export { AppearanceScreen } from '../features/profile/screens/AppearanceScreen';

// Modals
export { CartModal } from '../features/cart/screens/CartModal';
export { CheckoutScreen as CheckoutModal } from '../features/checkout/screens/CheckoutScreen';
export { CustomOrderScreen as CustomOrderModal } from '../features/custom-order/screens/CustomOrderScreen';

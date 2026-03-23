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
export const OrdersListScreen = createPlaceholder(ORDER_ROUTES.ORDERS_LIST, 15);
export const OrderDetailScreen = createPlaceholder(ORDER_ROUTES.ORDER_DETAIL, 15);
export { TrackingScreen } from '../features/orders/screens/TrackingScreen';

// Wallet
export const WalletScreen = createPlaceholder(WALLET_ROUTES.WALLET, 16);
export const TransactionsScreen = createPlaceholder(WALLET_ROUTES.TRANSACTIONS, 16);

// Profile
export const ProfileScreen = createPlaceholder(PROFILE_ROUTES.PROFILE, 17);
export const AddressesScreen = createPlaceholder(PROFILE_ROUTES.ADDRESSES, 17);
export const AddAddressScreen = createPlaceholder(PROFILE_ROUTES.ADD_ADDRESS, 17);
export const LanguageScreen = createPlaceholder(PROFILE_ROUTES.LANGUAGE, 17);
export const AppearanceScreen = createPlaceholder(PROFILE_ROUTES.APPEARANCE, 17);

// Modals
export { CartModal } from '../features/cart/screens/CartModal';
export { CheckoutScreen as CheckoutModal } from '../features/checkout/screens/CheckoutScreen';
export const CustomOrderModal = createPlaceholder(MODAL_ROUTES.CUSTOM_ORDER, 16);

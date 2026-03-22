import { createPlaceholder } from './PlaceholderScreen';
import {
  AUTH_ROUTES,
  HOME_ROUTES,
  ORDER_ROUTES,
  WALLET_ROUTES,
  PROFILE_ROUTES,
  MODAL_ROUTES,
} from './routes';

// Auth
export { PhoneScreen } from '../features/auth/screens/PhoneScreen';
export const OtpScreen = createPlaceholder(AUTH_ROUTES.OTP, 12);
export const RoleScreen = createPlaceholder(AUTH_ROUTES.ROLE, 12);
export const PendingApprovalScreen = createPlaceholder(AUTH_ROUTES.PENDING_APPROVAL, 12);
export const CustomerOnboardingScreen = createPlaceholder(AUTH_ROUTES.CUSTOMER_ONBOARDING, 12);
export const MerchantOnboardingScreen = createPlaceholder(AUTH_ROUTES.MERCHANT_ONBOARDING, 12);
export const DriverOnboardingScreen = createPlaceholder(AUTH_ROUTES.DRIVER_ONBOARDING, 12);

// Home
export const HomeScreen = createPlaceholder(HOME_ROUTES.HOME, 13);
export const SearchScreen = createPlaceholder(HOME_ROUTES.SEARCH, 18);
export const CategoryMerchantsScreen = createPlaceholder(HOME_ROUTES.CATEGORY_MERCHANTS, 15);
export const MerchantDetailScreen = createPlaceholder(HOME_ROUTES.MERCHANT_DETAIL, 14);

// Categories
export const CategoriesScreen = createPlaceholder('CategoriesScreen', 15);

// Orders
export const OrdersListScreen = createPlaceholder(ORDER_ROUTES.ORDERS_LIST, 15);
export const OrderDetailScreen = createPlaceholder(ORDER_ROUTES.ORDER_DETAIL, 15);
export const TrackingScreen = createPlaceholder(ORDER_ROUTES.TRACKING, 15);

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
export const CartModal = createPlaceholder(MODAL_ROUTES.CART, 14);
export const CheckoutModal = createPlaceholder(MODAL_ROUTES.CHECKOUT, 15);
export const CustomOrderModal = createPlaceholder(MODAL_ROUTES.CUSTOM_ORDER, 16);

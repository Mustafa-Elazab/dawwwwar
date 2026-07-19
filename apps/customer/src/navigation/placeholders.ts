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
export { CompleteProfileScreen } from '../features/auth/screens/CompleteProfileScreen';

// Home
export { HomeScreen } from '../features/home/screens/HomeScreen';
export { SearchScreen } from '../features/search/screens/SearchScreen';
export { CategoryMerchantsScreen } from '../features/categories/screens/CategoryMerchantsScreen';
export { MerchantDetailScreen } from '../features/merchant/screens/MerchantDetailScreen';
export { ProductDetailScreen } from '../features/product/screens/ProductDetailScreen';
export { LocationPickerScreen } from '../features/location/screens/LocationPickerScreen';
export { NearbyMerchantsScreen } from '../features/home/screens/NearbyMerchantsScreen';
export { PopularProductsScreen } from '../features/home/screens/PopularProductsScreen';

// Categories
export { CategoriesScreen } from '../features/categories/screens/CategoriesScreen';

// Orders
export { OrdersListScreen } from '../features/orders/screens/OrdersListScreen';
export { OrderDetailScreen } from '../features/orders/screens/OrderDetailScreen';
export { TrackingScreen } from '../features/orders/screens/TrackingScreen';
export { CancelOrderScreen } from '../features/orders/screens/CancelOrderScreen';

// Wallet
export { WalletScreen } from '../features/wallet/screens/WalletScreen';
export { TransactionsScreen } from '../features/wallet/screens/TransactionsScreen';

// Profile
export { ProfileScreen } from '../features/profile/screens/ProfileScreen';
export { EditProfileScreen } from '../features/profile/screens/EditProfileScreen';
export { AddressesScreen } from '../features/profile/screens/AddressesScreen';
export { LocationPickerScreen as AddAddressScreen } from '../features/profile/LocationPicker';
export { LanguageScreen } from '../features/profile/screens/LanguageScreen';
export { AppearanceScreen } from '../features/profile/screens/AppearanceScreen';
export { TermsScreen } from '../features/profile/screens/TermsScreen';
export { PrivacyScreen } from '../features/profile/screens/PrivacyScreen';
export { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
export { PaymentMethodsScreen } from '../features/profile/screens/PaymentMethodsScreen';
export { AddPaymentMethodScreen } from '../features/profile/screens/AddPaymentMethodScreen';
export { InviteFriendsScreen } from '../features/profile/screens/InviteFriendsScreen';
export { PromotionsScreen } from '../features/promotions/screens/PromotionsScreen';
export { GetMorePromotionsScreen } from '../features/promotions/screens/GetMorePromotionsScreen';

// Modals
export { CartModal } from '../features/cart/screens/CartModal';
export { CheckoutScreen as CheckoutModal } from '../features/checkout/screens/CheckoutScreen';
export { CustomOrderScreen as CustomOrderModal } from '../features/custom-order/screens/CustomOrderScreen';
export { CustomOrderMapPickerScreen } from '../features/custom-order/components/MapPickerModal';
export { PaymentWebViewScreen } from '../features/payment/PaymentWebView';

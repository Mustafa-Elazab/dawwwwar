import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  AUTH_ROUTES,
  TAB_ROUTES,
  HOME_ROUTES,
  ORDER_ROUTES,
  WALLET_ROUTES,
  PROFILE_ROUTES,
  MODAL_ROUTES,
} from './routes';

// ─── Auth Stack ──────────────────────────────────────────
export type AuthStackParamList = {
  [AUTH_ROUTES.AUTH_SELECTION]: undefined;
  [AUTH_ROUTES.LOGIN]: undefined;
  [AUTH_ROUTES.REGISTER]: undefined;
  [AUTH_ROUTES.OTP]: { phone: string; context: 'login' | 'signup' };
  [AUTH_ROUTES.PHONE]: undefined;
  [AUTH_ROUTES.ROLE]: undefined;
  [AUTH_ROUTES.CUSTOMER_ONBOARDING]: undefined;
  [AUTH_ROUTES.MERCHANT_ONBOARDING]: undefined;
  [AUTH_ROUTES.DRIVER_ONBOARDING]: undefined;
  [AUTH_ROUTES.PENDING_APPROVAL]: undefined;
};

// ─── Home Stack ───────────────────────────────────────────
export type HomeStackParamList = {
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.SEARCH]: { initialQuery?: string };
  [HOME_ROUTES.CATEGORY_MERCHANTS]: { categoryId: string; categoryName: string };
  [HOME_ROUTES.MERCHANT_DETAIL]: { merchantId: string };
};

// ─── Orders Stack ─────────────────────────────────────────
export type OrdersStackParamList = {
  [ORDER_ROUTES.ORDERS_LIST]: undefined;
  [ORDER_ROUTES.ORDER_DETAIL]: { orderId: string };
  [ORDER_ROUTES.TRACKING]: { orderId: string };
};

// ─── Wallet Stack ─────────────────────────────────────────
export type WalletStackParamList = {
  [WALLET_ROUTES.WALLET]: undefined;
  [WALLET_ROUTES.TRANSACTIONS]: undefined;
};

// ─── Profile Stack ────────────────────────────────────────
export type ProfileStackParamList = {
  [PROFILE_ROUTES.PROFILE]: undefined;
  [PROFILE_ROUTES.ADDRESSES]: undefined;
  [PROFILE_ROUTES.ADD_ADDRESS]: { editId?: string };
  [PROFILE_ROUTES.LANGUAGE]: undefined;
  [PROFILE_ROUTES.APPEARANCE]: undefined;
};

// ─── Tab Navigator ────────────────────────────────────────
export type CustomerTabParamList = {
  [TAB_ROUTES.HOME_TAB]: NavigatorScreenParams<HomeStackParamList>;
  [TAB_ROUTES.CATEGORIES_TAB]: undefined;
  [TAB_ROUTES.ORDERS_TAB]: NavigatorScreenParams<OrdersStackParamList>;
  [TAB_ROUTES.WALLET_TAB]: NavigatorScreenParams<WalletStackParamList>;
  [TAB_ROUTES.PROFILE_TAB]: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root (tabs + modals) ────────────────────────────────
export type RootParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  [MODAL_ROUTES.CART]: undefined;
  [MODAL_ROUTES.CHECKOUT]: undefined;
  [MODAL_ROUTES.CUSTOM_ORDER]: undefined;
};

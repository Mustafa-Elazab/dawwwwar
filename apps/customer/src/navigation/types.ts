import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  AUTH_ROUTES,
  TAB_ROUTES,
  HOME_ROUTES,
  LIKED_ROUTES,
  CATEGORY_ROUTES,
  ORDER_ROUTES,
  WALLET_ROUTES,
  PAYMENT_ROUTES,
  PROFILE_ROUTES,
  MODAL_ROUTES,
} from './routes';

// ─── Auth Stack ──────────────────────────────────────────
export type AuthStackParamList = {
  [AUTH_ROUTES.SPLASH]: undefined;
  [AUTH_ROUTES.ONBOARDING]: undefined;
  [AUTH_ROUTES.PHONE]: undefined;
  [AUTH_ROUTES.OTP]: { phone: string };
  [AUTH_ROUTES.COMPLETE_PROFILE]: undefined;
  [PROFILE_ROUTES.TERMS]: undefined;
  [PROFILE_ROUTES.PRIVACY]: undefined;
};

// ─── Home Stack ───────────────────────────────────────────
export type HomeStackParamList = {
  [HOME_ROUTES.HOME]: undefined;
  [HOME_ROUTES.CATEGORIES]: undefined;
  [HOME_ROUTES.SEARCH]: { initialQuery?: string };
  [HOME_ROUTES.CATEGORY_MERCHANTS]: { categoryId: string; categoryName: string };
  [HOME_ROUTES.MERCHANT_DETAIL]: { merchantId: string };
  [HOME_ROUTES.PRODUCT_DETAIL]: { productId: string };
  [HOME_ROUTES.LOCATION_PICKER]: undefined;
  [HOME_ROUTES.NEARBY_MERCHANTS]: undefined;
  [HOME_ROUTES.POPULAR_PRODUCTS]: undefined;
  [PROFILE_ROUTES.NOTIFICATIONS]: undefined;
};

export type CategoriesStackParamList = {
  [CATEGORY_ROUTES.CATEGORIES]: undefined;
  [HOME_ROUTES.CATEGORY_MERCHANTS]: { categoryId: string; categoryName: string };
  [HOME_ROUTES.MERCHANT_DETAIL]: { merchantId: string };
};

export type LikedStackParamList = {
  [LIKED_ROUTES.LIKED]: undefined;
  [HOME_ROUTES.PRODUCT_DETAIL]: { productId: string };
};

// ─── Orders Stack ─────────────────────────────────────────
export type OrdersStackParamList = {
  [ORDER_ROUTES.ORDERS_LIST]: undefined;
  [ORDER_ROUTES.ORDER_DETAIL]: { orderId: string };
  [ORDER_ROUTES.TRACKING]: { orderId: string };
  [ORDER_ROUTES.CANCEL_ORDER]: { orderId: string };
};

// ─── Wallet Stack ─────────────────────────────────────────
export type WalletStackParamList = {
  [WALLET_ROUTES.WALLET]: undefined;
  [WALLET_ROUTES.TRANSACTIONS]: undefined;
};

// ─── Profile Stack ────────────────────────────────────────
export type ProfileStackParamList = {
  [PROFILE_ROUTES.PROFILE]: undefined;
  [PROFILE_ROUTES.EDIT_PROFILE]: undefined;
  [PROFILE_ROUTES.ADDRESSES]: undefined;
  [PROFILE_ROUTES.ADD_ADDRESS]: { editId?: string };
  [PROFILE_ROUTES.LANGUAGE]: undefined;
  [PROFILE_ROUTES.APPEARANCE]: undefined;
  [PROFILE_ROUTES.TERMS]: undefined;
  [PROFILE_ROUTES.PRIVACY]: undefined;
  [WALLET_ROUTES.WALLET]: undefined;
  [WALLET_ROUTES.TRANSACTIONS]: undefined;
  [PROFILE_ROUTES.NOTIFICATIONS]: undefined;
  [PROFILE_ROUTES.PAYMENT_METHODS]: undefined;
  [PROFILE_ROUTES.ADD_PAYMENT_METHOD]: undefined;
  [PROFILE_ROUTES.INVITE_FRIENDS]: undefined;
  [PROFILE_ROUTES.PROMOTIONS]: undefined;
  [PROFILE_ROUTES.GET_MORE_PROMOTIONS]: undefined;
};

// ─── Tab Navigator ────────────────────────────────────────
export type CustomerTabParamList = {
  [TAB_ROUTES.HOME_TAB]: NavigatorScreenParams<HomeStackParamList>;
  [TAB_ROUTES.CATEGORY_TAB]: NavigatorScreenParams<CategoriesStackParamList>;
  [TAB_ROUTES.BASKET_TAB]: undefined;
  [TAB_ROUTES.ORDERS_TAB]: NavigatorScreenParams<OrdersStackParamList>;
  [TAB_ROUTES.LIKED_TAB]: NavigatorScreenParams<LikedStackParamList>;
  [TAB_ROUTES.PROFILE_TAB]: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root (tabs + modals) ────────────────────────────────
export type RootParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  [MODAL_ROUTES.CHECKOUT]: undefined;
  [MODAL_ROUTES.CUSTOM_ORDER]:
    | {
        pickedShopLocation?: {
          latitude: number;
          longitude: number;
          address: string;
        };
      }
    | undefined;
  [MODAL_ROUTES.CUSTOM_ORDER_MAP_PICKER]: {
    initialLatitude?: number;
    initialLongitude?: number;
  };
  [PAYMENT_ROUTES.PAYMENT_WEBVIEW]: {
    url: string;
    title: string;
    onSuccess?: () => void;
  };
};

import type { NavigatorScreenParams } from '@react-navigation/native';
import { AUTH_ROUTES, TAB_ROUTES, MERCHANT_ROUTES } from './routes';

export type AuthStackParamList = {
  PhoneScreen: undefined;
  OtpScreen: { phone: string };
  PendingApprovalScreen: undefined;
  RejectedScreen: undefined;
  CreateStoreScreen: undefined;
};

export type OrdersStackParamList = {
  MerchantOrdersScreen: undefined;
};

export type ProductsStackParamList = {
  ProductsScreen: undefined;
  AddEditProductScreen: { productId?: string };
};

export type MerchantTabParamList = {
  OrdersTab: NavigatorScreenParams<OrdersStackParamList>;
  ProductsTab: NavigatorScreenParams<ProductsStackParamList>;
  AnalyticsTab: undefined;
  ProfileTab: undefined;
};

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AUTH_ROUTES, TAB_ROUTES, DRIVER_ROUTES } from './routes';

export type AuthStackParamList = {
  [AUTH_ROUTES.PHONE]: undefined;
  [AUTH_ROUTES.OTP]: { phone: string };
  [AUTH_ROUTES.ROLE]: undefined;
  [AUTH_ROUTES.PENDING]: undefined;
};

export type OrdersStackParamList = {
  [DRIVER_ROUTES.ORDERS]: undefined;
};

export type ActiveDeliveryStackParamList = {
  [DRIVER_ROUTES.ACTIVE_DELIVERY]: { orderId: string };
  [DRIVER_ROUTES.COMPLETED_DELIVERY]: { orderId: string; netEarnings: number };
};

export type DriverTabParamList = {
  [TAB_ROUTES.AVAILABLE_ORDERS_TAB]: undefined;
  [TAB_ROUTES.ACTIVE_DELIVERY_TAB]: NavigatorScreenParams<ActiveDeliveryStackParamList>;
  [TAB_ROUTES.ORDERS_TAB]: NavigatorScreenParams<OrdersStackParamList>;
  [TAB_ROUTES.EARNINGS_TAB]: undefined;
  [TAB_ROUTES.PROFILE_TAB]: undefined;
};

export type DriverRootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  DriverTabs: NavigatorScreenParams<DriverTabParamList>;
};

export type DriverRootNavProp = StackNavigationProp<DriverRootStackParamList>;
export type DriverTabNavProp = BottomTabNavigationProp<DriverTabParamList>;

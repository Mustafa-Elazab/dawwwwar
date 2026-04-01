import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AUTH_ROUTES, TAB_ROUTES, DRIVER_ROUTES } from './routes';

export type AuthStackParamList = {
  [AUTH_ROUTES.PHONE]: undefined;
  [AUTH_ROUTES.OTP]: { phone: string };
  [AUTH_ROUTES.ROLE]: undefined;
  [AUTH_ROUTES.PENDING]: undefined;
};

export type AvailableOrdersStackParamList = {
  [DRIVER_ROUTES.AVAILABLE_ORDERS]: undefined;
};

export type ActiveDeliveryStackParamList = {
  [DRIVER_ROUTES.ACTIVE_DELIVERY]: { orderId: string };
  [DRIVER_ROUTES.COMPLETED_DELIVERY]: { orderId: string; netEarnings: number };
};

export type DriverTabParamList = {
  [TAB_ROUTES.AVAILABLE_ORDERS_TAB]: NavigatorScreenParams<AvailableOrdersStackParamList>;
  [TAB_ROUTES.ACTIVE_DELIVERY_TAB]: NavigatorScreenParams<ActiveDeliveryStackParamList>;
  [TAB_ROUTES.EARNINGS_TAB]: undefined;
  [TAB_ROUTES.PROFILE_TAB]: undefined;
};

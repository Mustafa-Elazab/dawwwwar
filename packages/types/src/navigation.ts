import type { Order, Merchant } from './models';

// Root level app params
export type RootStackParamList = Record<string, undefined>;

// Common navigation params shared across features
export interface OrderRouteParams {
  orderId: string;
}

export interface MerchantRouteParams {
  merchantId: string;
}

export interface ProductRouteParams {
  productId: string;
  merchantId: string;
}

export interface TrackingRouteParams {
  orderId: string;
  orderType?: 'REGULAR' | 'CUSTOM';
}

export interface OtpRouteParams {
  phone: string;
}

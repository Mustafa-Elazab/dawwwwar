import type { OrderStatus, OrderType } from '@dawwar/types';

export interface StatusTimelineProps {
  status: OrderStatus;
  orderType: OrderType;
}

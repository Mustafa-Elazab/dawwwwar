import type { Order } from '@dawwar/types';

export interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

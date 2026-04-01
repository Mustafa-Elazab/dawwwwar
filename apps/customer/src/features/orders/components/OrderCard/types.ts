import type { Order } from '@dawwar/types';

export interface OrderCardProps {
  order: Order;
  onTrack: () => void;
  onViewDetail: () => void;
}

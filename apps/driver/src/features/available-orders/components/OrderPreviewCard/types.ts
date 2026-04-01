import type { Order } from '@dawwar/types';

export interface OrderPreviewCardProps {
  order: Order;
  onAccept: () => void;
  onDecline: () => void;
  isAccepting: boolean;
}

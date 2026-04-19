import type { OrderStatus, OrderType } from '@dawwar/types';

export interface StatusActionPanelProps {
  status: OrderStatus;
  orderType: OrderType;
  isLoading: boolean;
  onNavigate: () => void;
  onArrived: () => void;
  onConfirmPickup: () => void;
  onCallContact: () => void;
  onConfirmDelivery: () => void;
}

import type { Order } from '@dawwar/types';
export interface NewOrderModalProps {
  order: Order | null;
  onAccept: (prepMinutes: number) => void;
  onReject: () => void;
  isAccepting: boolean;
  visible: boolean;
}

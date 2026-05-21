import type { Order } from '@dawwar/types';

export interface OrderListItemVM {
  id: string;
  merchantName: string;
  status: string;
  statusColor: 'success' | 'warning' | 'error' | 'info';
  total: number;
  itemCount: number;
  createdAt: string;
  isActive: boolean;
}

const STATUS_COLOR: Record<string, OrderListItemVM['statusColor']> = {
  pending: 'warning',
  accepted: 'info',
  preparing: 'info',
  ready: 'info',
  picked_up: 'info',
  on_the_way: 'info',
  delivered: 'success',
  cancelled: 'error',
  rejected: 'error',
};

export function mapOrderToListItem(o: Order): OrderListItemVM {
  const isActive = !['delivered', 'cancelled', 'rejected'].includes(o.status);
  return {
    id: o.id,
    merchantName: o.merchant?.businessName ?? '',
    status: o.status,
    statusColor: STATUS_COLOR[o.status] ?? 'info',
    total: o.total,
    itemCount: o.items?.length ?? 0,
    createdAt: o.createdAt,
    isActive,
  };
}

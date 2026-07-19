import api from '../../../core/api/client';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realActiveDeliveryApi = {
  getOrderById: async (orderId: string) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
  updateStatus: async (orderId: string, status: OrderStatus, extra?: object) => {
    const { data } = await api.patch(`/orders/driver/${orderId}/status`, { status, ...extra });
    return data;
  },
  sendShoppingPhotos: async (orderId: string, photoUris: string[]) => {
    const { data } = await api.post(`/driver/orders/${orderId}/shopping-photos`, { photoUris });
    return data;
  },
};


export const activeDeliveryApi = realActiveDeliveryApi;

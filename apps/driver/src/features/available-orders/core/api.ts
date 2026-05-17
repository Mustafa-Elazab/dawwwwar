import api from '../../../core/api/client';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realAvailableOrdersApi = {
  getAvailable: async () => {
    const { data } = await api.get('/driver/available-orders');
    return data;
  },
  acceptOrder: async (orderId: string) => {
    const { data } = await api.post(`/driver/orders/${orderId}/accept`);
    return data;
  },
  declineOrder: async (orderId: string) => {
    const { data } = await api.post(`/driver/orders/${orderId}/decline`);
    return data;
  },
  updateLocation: async (latitude: number, longitude: number) => {
    const { data } = await api.patch('/driver/location', { latitude, longitude });
    return data;
  },
};


export const availableOrdersApi = realAvailableOrdersApi;

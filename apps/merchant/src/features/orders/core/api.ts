import api from '../../../core/api/client';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realMerchantOrdersApi = {
  getOrders: async (merchantId: string) => {
    const { data } = await api.get(`/merchant/orders?merchantId=${merchantId}`);
    return data;
  },
  acceptOrder: async (orderId: string, prepMinutes: number) => {
    const { data } = await api.post(`/merchant/orders/${orderId}/accept`, { prepMinutes });
    return data;
  },
  rejectOrder: async (orderId: string, reason: string) => {
    const { data } = await api.post(`/merchant/orders/${orderId}/reject`, { reason });
    return data;
  },
  markReady: async (orderId: string) => {
    const { data } = await api.post(`/merchant/orders/${orderId}/ready`);
    return data;
  },
};


export const merchantOrdersApi = realMerchantOrdersApi;

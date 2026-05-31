import api from '../../../core/api/client';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realOrdersApi = {
  getMyOrders: async (): Promise<ApiResponse<Order[]> | Order[]> => {
    const { data } = await api.get('/orders/my');
    return data;
  },
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  placeOrder: async (payload: object): Promise<ApiResponse<Order>> => {
    const { data } = await api.post('/orders', payload);
    return data;
  },
  placeCustomOrder: async (payload: object): Promise<ApiResponse<Order>> => {
    const { data } = await api.post('/orders/custom', payload);
    return data;
  },
  cancelOrder: async (id: string, reason?: string): Promise<ApiResponse<Order>> => {
    const { data } = await api.post(`/orders/${id}/cancel`, { reason });
    return data;
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const ordersApi = realOrdersApi;

import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { ordersMock } from '@dawwar/mocks';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realOrdersApi = {
  getMyOrders: async (customerId: string): Promise<ApiResponse<Order[]>> => {
    const { data } = await api.get(`/orders?customerId=${customerId}`);
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
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const ordersApi = USE_MOCK_API ? ordersMock : realOrdersApi;

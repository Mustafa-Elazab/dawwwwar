import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockOrders } from '@dawwar/mocks';
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

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockMerchantOrdersApi = {
  getOrders: async (merchantId: string): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return { success: true, data: mockOrders.filter((o) => o.merchantId === merchantId) };
  },
  acceptOrder: async (orderId: string, _prepMinutes: number): Promise<ApiResponse<Order>> => {
    await delay(800);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return { success: true, data: { ...order, status: OrderStatus.ACCEPTED } };
  },
  rejectOrder: async (orderId: string, _reason: string): Promise<ApiResponse<Order>> => {
    await delay(500);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return { success: true, data: { ...order, status: OrderStatus.REJECTED } };
  },
  markReady: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(600);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return { success: true, data: { ...order, status: OrderStatus.DRIVER_ASSIGNED } };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const merchantOrdersApi = USE_MOCK_API ? mockMerchantOrdersApi : realMerchantOrdersApi;

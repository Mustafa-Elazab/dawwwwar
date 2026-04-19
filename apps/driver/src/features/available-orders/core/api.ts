import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockOrders } from '@dawwar/mocks';
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
};

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockAvailableOrdersApi = {
  getAvailable: async (): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return {
      success: true,
      data: mockOrders.filter((o) => o.status === OrderStatus.PENDING && !o.driverId),
    };
  },
  acceptOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(1000);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return {
      success: true,
      data: { ...order, status: OrderStatus.DRIVER_ASSIGNED, driverId: 'user-driver-01' },
    };
  },
  declineOrder: async (orderId: string): Promise<ApiResponse<{ declined: boolean }>> => {
    await delay(400);
    return { success: true, data: { declined: true } };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const availableOrdersApi = USE_MOCK_API ? mockAvailableOrdersApi : realAvailableOrdersApi;

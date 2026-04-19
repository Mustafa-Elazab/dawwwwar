import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockOrders } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realActiveDeliveryApi = {
  getOrderById: async (orderId: string) => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
  updateStatus: async (orderId: string, status: OrderStatus, extra?: object) => {
    const { data } = await api.patch(`/driver/orders/${orderId}/status`, { status, ...extra });
    return data;
  },
  sendShoppingPhotos: async (orderId: string, photoUris: string[]) => {
    const { data } = await api.post(`/driver/orders/${orderId}/shopping-photos`, { photoUris });
    return data;
  },
};

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockActiveDeliveryApi = {
  getOrderById: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(400);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return { success: true, data: order };
  },
  updateStatus: async (
    orderId: string,
    status: OrderStatus,
    extra?: { actualAmount?: number; receiptImage?: string },
  ): Promise<ApiResponse<Order>> => {
    await delay(700);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return {
      success: true,
      data: { ...order, status, ...extra },
    };
  },
  sendShoppingPhotos: async (_orderId: string, _photoUris: string[]): Promise<ApiResponse<{ sent: boolean }>> => {
    await delay(600);
    return { success: true, data: { sent: true } };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const activeDeliveryApi = USE_MOCK_API ? mockActiveDeliveryApi : realActiveDeliveryApi;

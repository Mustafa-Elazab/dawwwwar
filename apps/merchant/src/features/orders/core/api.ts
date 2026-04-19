import { delay } from '@dawwar/mocks';
import { mockOrders, mockMerchants } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

export const merchantOrdersApi = {
  getOrders: async (merchantId: string): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return {
      success: true,
      data: mockOrders.filter((o) => o.merchantId === merchantId),
    };
  },

  acceptOrder: async (orderId: string, prepMinutes: number): Promise<ApiResponse<Order>> => {
    await delay(800);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return {
      success: true,
      data: { ...order, status: OrderStatus.ACCEPTED },
    };
  },

  rejectOrder: async (orderId: string, reason: string): Promise<ApiResponse<Order>> => {
    await delay(500);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return {
      success: true,
      data: { ...order, status: OrderStatus.REJECTED },
    };
  },

  markReady: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(600);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    return {
      success: true,
      data: { ...order, status: OrderStatus.DRIVER_ASSIGNED },
    };
  },
};

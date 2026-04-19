import { delay } from '@dawwar/mocks';
import { mockOrders } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

export const activeDeliveryApi = {
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
      data: {
        ...order,
        status,
        actualAmount: extra?.actualAmount ?? order.actualAmount,
        receiptImage: extra?.receiptImage ?? order.receiptImage,
      },
    };
  },

  sendShoppingPhotos: async (
    orderId: string,
    photoUris: string[],
  ): Promise<ApiResponse<{ sent: boolean }>> => {
    await delay(600);
    return { success: true, data: { sent: true } };
  },
};

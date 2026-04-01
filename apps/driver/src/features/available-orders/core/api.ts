import { delay } from '@dawwar/mocks';
import { mockOrders } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

export const availableOrdersApi = {
  // Returns orders that are PENDING and have no driver assigned yet
  // In Phase 1: just filter the mock orders
  getAvailable: async (): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return {
      success: true,
      data: mockOrders.filter(
        (o) => o.status === OrderStatus.PENDING && !o.driverId,
      ),
    };
  },

  acceptOrder: async (orderId: string): Promise<ApiResponse<Order>> => {
    await delay(1000);
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error('NOT_FOUND');
    // Simulate acceptance — return order with DRIVER_ASSIGNED status
    return {
      success: true,
      data: {
        ...order,
        status: OrderStatus.DRIVER_ASSIGNED,
        driverId: 'user-driver-01',
      },
    };
  },

  declineOrder: async (orderId: string): Promise<ApiResponse<{ declined: boolean }>> => {
    await delay(400);
    return { success: true, data: { declined: true } };
  },
};

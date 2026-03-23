import { ordersMock } from '@dawwar/mocks';
import type { ApiResponse, Order } from '@dawwar/types';

export const ordersApi = {
  getMyOrders: (customerId: string): Promise<ApiResponse<Order[]>> =>
    ordersMock.getMyOrders(customerId),

  getById: (id: string): Promise<ApiResponse<Order>> =>
    ordersMock.getById(id),

  placeOrder: (
    payload: Parameters<typeof ordersMock.placeOrder>[0],
  ): Promise<ApiResponse<Order>> => ordersMock.placeOrder(payload),

  placeCustomOrder: (
    payload: Parameters<typeof ordersMock.placeCustomOrder>[0],
  ): Promise<ApiResponse<Order>> => ordersMock.placeCustomOrder(payload),
};

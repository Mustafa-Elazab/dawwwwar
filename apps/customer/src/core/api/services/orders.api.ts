import { api } from '../client';
import type { ApiResponse, Order } from '@dawwar/types';

export const ordersApi = {
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

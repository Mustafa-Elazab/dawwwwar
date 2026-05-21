import { api } from '../client';
import type { ApiResponse, Merchant, Product } from '@dawwar/types';

export const merchantsApi = {
  getNearby: async (lat?: number, lng?: number, allEgypt?: boolean): Promise<ApiResponse<Merchant[]>> => {
    const params: Record<string, unknown> = {};
    if (lat && lng) {
      params.latitude = lat;
      params.longitude = lng;
    }
    if (allEgypt) params.allEgypt = true;
    const { data } = await api.get('/merchants/nearby', { params });
    return data;
  },
  getById: async (id: string): Promise<ApiResponse<Merchant>> => {
    const { data } = await api.get(`/merchants/${id}`);
    return data;
  },
  getProducts: async (merchantId: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get(`/merchants/${merchantId}/products`);
    return data;
  },
};

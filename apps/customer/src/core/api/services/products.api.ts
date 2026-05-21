import { api } from '../client';
import type { ApiResponse, Product } from '@dawwar/types';

export const productsApi = {
  getFeatured: async (lat?: number, lng?: number): Promise<ApiResponse<Product[]>> => {
    let url = '/products/featured';
    if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return data;
  },
};

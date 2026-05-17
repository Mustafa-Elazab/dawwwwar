import api from '../../../core/api/client';
import type { ApiResponse, Merchant, Product, Category } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realHomeApi = {
  getNearbyMerchants: async (lat?: number, lng?: number, allEgypt?: boolean): Promise<ApiResponse<Merchant[]>> => {
    const params: any = {};
    if (lat && lng) {
      params.latitude = lat;
      params.longitude = lng;
    }
    if (allEgypt) params.allEgypt = true;
    const { data } = await api.get('/merchants/nearby', { params });
    return data;
  },
  getFeaturedProducts: async (lat?: number, lng?: number): Promise<ApiResponse<Product[]>> => {
    let url = '/products/featured';
    if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return data;
  },
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories');
    return data;
  },
};


export const homeApi = realHomeApi;

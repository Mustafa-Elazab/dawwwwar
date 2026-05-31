import api from '../../../core/api/client';
import type { ApiResponse, Merchant, Product, Category } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realHomeApi = {
  getNearbyMerchants: async (lat?: number, lng?: number): Promise<ApiResponse<Merchant[]> | Merchant[]> => {
    const params: any = {};
    if (lat != null && lng != null) {
      params.latitude = lat;
      params.longitude = lng;
      params.radiusKm = 10;
    }
    const { data } = await api.get('/merchants/nearby', { params });
    return data;
  },
  getFeaturedProducts: async (lat?: number, lng?: number): Promise<ApiResponse<Product[]> | Product[]> => {
    let url = '/products/featured';
    if (lat != null && lng != null) url += `?lat=${lat}&lng=${lng}&radiusKm=10`;
    const { data } = await api.get(url);
    return data;
  },
  getCategories: async (lat?: number, lng?: number): Promise<ApiResponse<Category[]> | Category[]> => {
    const params: any = {};
    if (lat != null && lng != null) {
      params.lat = lat;
      params.lng = lng;
      params.radiusKm = 10;
    }
    const { data } = await api.get('/categories', { params });
    return data;
  },
};


export const homeApi = realHomeApi;

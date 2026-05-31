import api from '../../../core/api/client';
import type { ApiResponse, Category, Merchant } from '@dawwar/types';

const unwrap = <T,>(res: T | ApiResponse<T>): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

// ── Phase 2 real implementations ─────────────────────────────────────
const realCategoriesApi = {
  getAll: async (lat?: number, lng?: number): Promise<Category[]> => {
    const params: Record<string, number> = {};
    if (lat != null && lng != null) {
      params.lat = lat;
      params.lng = lng;
      params.radiusKm = 10;
    }
    const { data } = await api.get('/categories', { params });
    return unwrap<Category[]>(data);
  },
  getMerchantsByCategory: async (categoryId: string, lat?: number, lng?: number): Promise<Merchant[]> => {
    let url = `/merchants?categoryId=${categoryId}&radiusKm=10`;
    if (lat != null && lng != null) url += `&lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return unwrap<Merchant[]>(data);
  },
};


export const categoriesApi = realCategoriesApi;

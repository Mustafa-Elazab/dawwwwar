import api from '../../../core/api/client';
import type { ApiResponse, Category, Merchant } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCategoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories');
    return data;
  },
  getMerchantsByCategory: async (categoryId: string, lat?: number, lng?: number): Promise<ApiResponse<Merchant[]>> => {
    let url = `/merchants?categoryId=${categoryId}`;
    if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return data;
  },
};


export const categoriesApi = realCategoriesApi;

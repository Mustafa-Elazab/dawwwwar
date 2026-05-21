import type { ApiResponse, Category, Merchant } from '@dawwar/types';
import { categoriesApi as categoriesService } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCategoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => categoriesService.getAll(),
  getMerchantsByCategory: async (categoryId: string, lat?: number, lng?: number): Promise<ApiResponse<Merchant[]>> =>
    categoriesService.getMerchantsByCategory(categoryId, lat, lng),
};


export const categoriesApi = realCategoriesApi;

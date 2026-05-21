import type { ApiResponse, Merchant, Product, Category } from '@dawwar/types';
import { merchantsApi, productsApi, categoriesApi } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realHomeApi = {
  getNearbyMerchants: async (
    lat?: number,
    lng?: number,
    allEgypt?: boolean,
  ): Promise<ApiResponse<Merchant[]>> => merchantsApi.getNearby(lat, lng, allEgypt),
  getFeaturedProducts: async (lat?: number, lng?: number): Promise<ApiResponse<Product[]>> =>
    productsApi.getFeatured(lat, lng),
  getCategories: async (): Promise<ApiResponse<Category[]>> => categoriesApi.getAll(),
};

export const homeApi = realHomeApi;

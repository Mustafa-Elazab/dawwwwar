import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { merchantsMock, delay, mockProducts, mockCategories } from '@dawwar/mocks';
import type { ApiResponse, Merchant, Product, Category } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realHomeApi = {
  getNearbyMerchants: async (): Promise<ApiResponse<Merchant[]>> => {
    const { data } = await api.get('/merchants/nearby');
    return data;
  },
  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get('/products/featured');
    return data;
  },
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories');
    return data;
  },
};

const mockHomeApi = {
  getNearbyMerchants: () => merchantsMock.getNearby(),
  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    await delay(500);
    return { success: true, data: mockProducts.filter((p) => p.isFeatured && p.isAvailable) };
  },
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    await delay(300);
    return { success: true, data: mockCategories.filter((c) => c.isActive) };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const homeApi = USE_MOCK_API ? mockHomeApi : realHomeApi;

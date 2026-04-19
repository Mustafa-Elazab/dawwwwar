import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { merchantsMock, mockCategories, delay } from '@dawwar/mocks';
import type { ApiResponse, Category, Merchant } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCategoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    const { data } = await api.get('/categories');
    return data;
  },
  getMerchantsByCategory: async (categoryId: string): Promise<ApiResponse<Merchant[]>> => {
    const { data } = await api.get(`/merchants?categoryId=${categoryId}`);
    return data;
  },
};

const mockCategoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    await delay(400);
    return { success: true, data: mockCategories.filter((c) => c.isActive) };
  },
  getMerchantsByCategory: async (categoryId: string): Promise<ApiResponse<Merchant[]>> => {
    const all = await merchantsMock.getNearby();
    return { success: true, data: all.data.filter((m) => m.category === categoryId) };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const categoriesApi = USE_MOCK_API ? mockCategoriesApi : realCategoriesApi;

import { merchantsMock } from '@dawwar/mocks';
import { mockCategories } from '@dawwar/mocks';
import { delay } from '@dawwar/mocks';
import type { ApiResponse, Category, Merchant } from '@dawwar/types';

export const categoriesApi = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    await delay(400);
    return {
      success: true,
      data: mockCategories.filter((c) => c.isActive),
    };
  },

  getMerchantsByCategory: async (categoryId: string): Promise<ApiResponse<Merchant[]>> => {
    const all = await merchantsMock.getNearby();
    return {
      success: true,
      data: all.data.filter((m) => m.category === categoryId),
    };
  },
};

import { delay } from '../utils/delay';
import { mockCategories } from '../db/categories';
import type { ApiResponse, Category } from '@dawwar/types';

export const categoriesMock = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    await delay(300);
    return {
      success: true,
      data: mockCategories.filter((c) => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder),
    };
  },
};

import { delay } from '../utils/delay';
import { getProductById, getProductsByMerchant, getFeaturedProducts } from '../db/products';
import type { ApiResponse, Product } from '@dawwar/types';

export const productsMock = {
  getByMerchant: async (merchantId: string): Promise<ApiResponse<Product[]>> => {
    await delay(500);
    return { success: true, data: getProductsByMerchant(merchantId) };
  },
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    await delay(300);
    const p = getProductById(id);
    if (!p) throw Object.assign(new Error('NOT_FOUND'), { code: 'NOT_FOUND' });
    return { success: true, data: p };
  },
  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    await delay(400);
    return { success: true, data: getFeaturedProducts() };
  },
};

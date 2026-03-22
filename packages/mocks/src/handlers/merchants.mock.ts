import { delay } from '../utils/delay';
import { mockMerchants, getMerchantById } from '../db/merchants';
import { getProductsByMerchant, getFeaturedProducts } from '../db/products';
import type { ApiResponse, Merchant, Product } from '@dawwar/types';

export const merchantsMock = {
  getNearby: async (): Promise<ApiResponse<Merchant[]>> => {
    await delay(700);
    return { success: true, data: mockMerchants.filter((m) => m.isApproved) };
  },

  getById: async (id: string): Promise<ApiResponse<Merchant>> => {
    await delay(500);
    const m = getMerchantById(id);
    if (!m) throw Object.assign(new Error('NOT_FOUND'), { code: 'NOT_FOUND' });
    return { success: true, data: m };
  },

  getProducts: async (merchantId: string): Promise<ApiResponse<Product[]>> => {
    await delay(600);
    return { success: true, data: getProductsByMerchant(merchantId) };
  },

  getFeatured: async (): Promise<ApiResponse<Product[]>> => {
    await delay(400);
    return { success: true, data: getFeaturedProducts() };
  },
};

import type { ApiResponse, Category, Merchant, Product } from '@dawwar/types';
import { categoriesApi } from './categories.api';
import { merchantsApi } from './merchants.api';
import { productsApi } from './products.api';

export const homeApi = {
  getNearbyMerchants: async (lat?: number, lng?: number): Promise<ApiResponse<Merchant[]>> =>
    merchantsApi.getNearby(lat, lng, false),
  getCategories: async (): Promise<ApiResponse<Category[]>> => categoriesApi.getAll(),
  getFeaturedProducts: async (lat?: number, lng?: number): Promise<ApiResponse<Product[]>> =>
    productsApi.getFeatured(lat, lng),
};

import { merchantsMock } from '@dawwar/mocks';
import type { ApiResponse, Merchant, Product } from '@dawwar/types';

export const homeApi = {
  getNearbyMerchants: (): Promise<ApiResponse<Merchant[]>> =>
    merchantsMock.getNearby(),

  getFeaturedProducts: (): Promise<ApiResponse<Product[]>> =>
    merchantsMock.getFeatured(),
};

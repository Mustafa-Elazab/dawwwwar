import { merchantsMock } from '@dawwar/mocks';
import type { ApiResponse, Merchant, Product } from '@dawwar/types';

export const merchantApi = {
  getById: (id: string): Promise<ApiResponse<Merchant>> =>
    merchantsMock.getById(id),

  getProducts: (merchantId: string): Promise<ApiResponse<Product[]>> =>
    merchantsMock.getProducts(merchantId),
};

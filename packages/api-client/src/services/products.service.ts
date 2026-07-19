import { AxiosInstance } from 'axios';
import { ApiResponse, Product } from '@dawwar/types';

export class ProductsService {
  constructor(private publicClient: AxiosInstance) {}

  async getById(productId: string): Promise<ApiResponse<Product>> {
    const { data } = await this.publicClient.get(`/products/${productId}`);
    return data;
  }
}

import { AxiosInstance } from 'axios';
import { ApiResponse, Merchant, Product } from '@dawwar/types';
import { CreateMerchantDto, UpdateMerchantDto } from '../types/merchant.types';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';

export interface NearbyFilter {
  latitude?: number;
  longitude?: number;
  radius?: number;
  categoryId?: string;
  filter?: 'open' | 'all';
}

export class MerchantService {
  constructor(private publicClient: AxiosInstance, private authClient: AxiosInstance) {}

  async getNearby(filter: NearbyFilter): Promise<ApiResponse<Merchant[]>> {
    const { data } = await this.publicClient.get('/merchants/nearby', { params: filter });
    return data;
  }

  async getById(id: string): Promise<ApiResponse<Merchant>> {
    const { data } = await this.publicClient.get(`/merchants/${id}`);
    return data;
  }

  async getProducts(id: string): Promise<ApiResponse<Product[]>> {
    const { data } = await this.publicClient.get(`/merchants/${id}/products`);
    return data;
  }

  async getMyMerchant(): Promise<ApiResponse<Merchant>> {
    const { data } = await this.authClient.get('/merchants/my');
    return data;
  }

  async createMerchant(dto: CreateMerchantDto): Promise<ApiResponse<Merchant>> {
    const { data } = await this.authClient.post('/merchants', dto);
    return data;
  }

  async updateMerchant(id: string, updates: UpdateMerchantDto): Promise<ApiResponse<Merchant>> {
    const { data } = await this.authClient.patch(`/merchants/${id}`, updates);
    return data;
  }

  // ── Product Management ──────────────────────────────────────────

  async createProduct(product: CreateProductDto): Promise<ApiResponse<Product>> {
    const { data } = await this.authClient.post('/products', product);
    return data;
  }

  async updateProduct(id: string, updates: UpdateProductDto): Promise<ApiResponse<Product>> {
    const { data } = await this.authClient.patch(`/products/${id}`, updates);
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.authClient.delete(`/products/${id}`);
  }

  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    const { data } = await this.publicClient.get('/products/featured');
    return data;
  }
}

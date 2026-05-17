import { AxiosInstance } from 'axios';
import { ApiResponse, Category } from '@dawwar/types';

export class CategoriesService {
  constructor(private client: AxiosInstance) {}

  async findAll(): Promise<ApiResponse<Category[]>> {
    const { data } = await this.client.get('/categories');
    return data;
  }
}

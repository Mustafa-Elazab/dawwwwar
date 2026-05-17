import { AxiosInstance } from 'axios';
import { ApiResponse, Address, User } from '@dawwar/types';

export class ProfileService {
  constructor(private client: AxiosInstance) {}

  async getAddresses(userId: string): Promise<ApiResponse<Address[]>> {
    const { data } = await this.client.get(`/addresses?userId=${userId}`);
    return data;
  }

  async saveAddress(address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<ApiResponse<Address>> {
    const { data } = await this.client.post('/addresses', address);
    return data;
  }

  async deleteAddress(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const { data } = await this.client.delete(`/addresses/${id}`);
    return data;
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const { data } = await this.client.patch('/users/me', updates);
    return data;
  }
}

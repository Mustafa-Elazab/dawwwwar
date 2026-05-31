import { AxiosInstance } from 'axios';
import { ApiResponse, Address, User } from '@dawwar/types';

export type SaveAddressPayload = Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & {
  id?: string;
};

export class ProfileService {
  constructor(private client: AxiosInstance) {}

  async getAddresses(_userId: string): Promise<ApiResponse<Address[]>> {
    const { data } = await this.client.get('/addresses');
    return data;
  }

  async saveAddress(address: SaveAddressPayload): Promise<ApiResponse<Address>> {
    const { id, ...payload } = address;
    const { data } = id
      ? await this.client.patch(`/addresses/${id}`, payload)
      : await this.client.post('/addresses', payload);
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

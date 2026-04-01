import { delay } from '../utils/delay';
import { mockAddresses } from '../db/addresses';
import type { ApiResponse, Address } from '@dawwar/types';

export const addressesMock = {
  getByUser: async (userId: string): Promise<ApiResponse<Address[]>> => {
    await delay(400);
    return { success: true, data: mockAddresses.filter((a) => a.userId === userId) };
  },
  save: async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Address>> => {
    await delay(700);
    const saved: Address = {
      ...address,
      id: `addr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { success: true, data: saved };
  },
  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    await delay(400);
    return { success: true, data: { deleted: true } };
  },
};

import { api } from '../client';
import type { Address } from '@dawwar/types';

export const addressesApi = {
  getAddresses: async (userId: string) => {
    const { data } = await api.get(`/addresses?userId=${userId}`);
    return data;
  },
  saveAddress: async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data } = await api.post('/addresses', address);
    return data;
  },
  deleteAddress: async (id: string) => {
    const { data } = await api.delete(`/addresses/${id}`);
    return data;
  },
};

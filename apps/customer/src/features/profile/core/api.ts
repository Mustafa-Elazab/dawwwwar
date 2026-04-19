import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { addressesMock } from '@dawwar/mocks';
import type { Address } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realProfileApi = {
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

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const profileApi = USE_MOCK_API ? addressesMock : realProfileApi;

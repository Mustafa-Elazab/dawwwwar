import api from '../../../core/api/client';
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

// ── Mock implementation wrapper to match real API ──────────────────

export const profileApi = realProfileApi;

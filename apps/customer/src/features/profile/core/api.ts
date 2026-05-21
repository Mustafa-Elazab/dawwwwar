import type { Address } from '@dawwar/types';
import { addressesApi } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realProfileApi = {
  getAddresses: async (userId: string) => addressesApi.getAddresses(userId),
  saveAddress: async (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) =>
    addressesApi.saveAddress(address),
  deleteAddress: async (id: string) => addressesApi.deleteAddress(id),
};

// ── Mock implementation wrapper to match real API ──────────────────

export const profileApi = realProfileApi;

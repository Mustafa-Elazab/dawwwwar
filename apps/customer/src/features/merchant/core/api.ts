import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { merchantsMock } from '@dawwar/mocks';
import type { ApiResponse, Merchant, Product } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realMerchantApi = {
  getById: async (id: string): Promise<ApiResponse<Merchant>> => {
    const { data } = await api.get(`/merchants/${id}`);
    return data;
  },
  getProducts: async (merchantId: string): Promise<ApiResponse<Product[]>> => {
    const { data } = await api.get(`/merchants/${merchantId}/products`);
    return data;
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const merchantApi = USE_MOCK_API ? merchantsMock : realMerchantApi;

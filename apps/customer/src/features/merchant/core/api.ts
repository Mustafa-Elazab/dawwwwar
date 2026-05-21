import type { ApiResponse, Merchant, Product } from '@dawwar/types';
import { merchantsApi } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realMerchantApi = {
  getById: async (id: string): Promise<ApiResponse<Merchant>> => merchantsApi.getById(id),
  getProducts: async (merchantId: string): Promise<ApiResponse<Product[]>> =>
    merchantsApi.getProducts(merchantId),
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const merchantApi = realMerchantApi;

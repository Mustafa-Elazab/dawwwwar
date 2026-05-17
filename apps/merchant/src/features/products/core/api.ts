import api from '../../../core/api/client';
import type { ApiResponse, Product } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realProductsApi = {
  getProducts: async (merchantId: string) => {
    const { data } = await api.get(`/products?merchantId=${merchantId}`);
    return data;
  },
  toggleAvailability: async (productId: string, isAvailable: boolean) => {
    const { data } = await api.patch(`/products/${productId}`, { isAvailable });
    return data;
  },
  saveProduct: async (product: object) => {
    const { data } = await api.post('/products', product);
    return data;
  },
  updateProduct: async (productId: string, updates: object) => {
    const { data } = await api.patch(`/products/${productId}`, updates);
    return data;
  },
  deleteProduct: async (productId: string) => {
    const { data } = await api.delete(`/products/${productId}`);
    return data;
  },
};


export const productsCatalogApi = realProductsApi;

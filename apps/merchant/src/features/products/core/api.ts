import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockProducts } from '@dawwar/mocks';
import type { ApiResponse, Product } from '@dawwar/types';

// Phase 1: in-memory mutations (changes don't persist across sessions)
let products = [...mockProducts];

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

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockProductsApi = {
  getProducts: async (merchantId: string): Promise<ApiResponse<Product[]>> => {
    await delay(500);
    return { success: true, data: products.filter((p) => p.merchantId === merchantId) };
  },
  toggleAvailability: async (productId: string, isAvailable: boolean): Promise<ApiResponse<Product>> => {
    await delay(400);
    products = products.map((p) => (p.id === productId ? { ...p, isAvailable } : p));
    const updated = products.find((p) => p.id === productId);
    if (!updated) throw new Error('NOT_FOUND');
    return { success: true, data: updated };
  },
  saveProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders'>): Promise<ApiResponse<Product>> => {
    await delay(800);
    const newProduct: Product = {
      ...product,
      id: `prod-new-${Date.now()}`,
      totalOrders: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [...products, newProduct];
    return { success: true, data: newProduct };
  },
  updateProduct: async (productId: string, updates: Partial<Product>): Promise<ApiResponse<Product>> => {
    await delay(700);
    products = products.map((p) => (p.id === productId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    const updated = products.find((p) => p.id === productId);
    if (!updated) throw new Error('NOT_FOUND');
    return { success: true, data: updated };
  },
  deleteProduct: async (productId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    await delay(500);
    products = products.filter((p) => p.id !== productId);
    return { success: true, data: { deleted: true } };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const productsCatalogApi = USE_MOCK_API ? mockProductsApi : realProductsApi;

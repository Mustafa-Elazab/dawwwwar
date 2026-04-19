import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockMerchants, mockProducts, mockCategories } from '@dawwar/mocks';
import type { Merchant, Product, Category } from '@dawwar/types';

export interface SearchResults {
  merchants: Merchant[];
  products: Product[];
  categories: Category[];
  query: string;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realSearchApi = {
  search: async (query: string): Promise<SearchResults> => {
    const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return data.data;
  },
};

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockSearchApi = {
  search: async (query: string): Promise<SearchResults> => {
    await delay(300);
    if (!query.trim()) return { merchants: [], products: [], categories: [], query };
    const q = query.toLowerCase().trim();
    return {
      merchants: mockMerchants.filter((m) => m.businessName.toLowerCase().includes(q)),
      products: mockProducts.filter((p) => p.name.toLowerCase().includes(q) || p.nameAr.includes(q)),
      categories: mockCategories.filter((c) => c.name.toLowerCase().includes(q) || c.nameAr.includes(q)),
      query,
    };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const searchApi = USE_MOCK_API ? mockSearchApi : realSearchApi;

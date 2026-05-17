import api from '../../../core/api/client';
import type { Merchant, Product, Category } from '@dawwar/types';

export interface SearchResults {
  merchants: Merchant[];
  products: Product[];
  categories: Category[];
  query: string;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realSearchApi = {
  search: async (query: string, lat?: number, lng?: number): Promise<SearchResults> => {
    let url = `/search?q=${encodeURIComponent(query)}`;
    if (lat && lng) url += `&lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return data.data;
  },
};


export const searchApi = realSearchApi;

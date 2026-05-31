import api from '../../../core/api/client';
import type { Merchant, Product, Category } from '@dawwar/types';

export interface SearchResults {
  merchants: Merchant[];
  products: Product[];
  categories: Category[];
  query: string;
}

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

// ── Phase 2 real implementations ─────────────────────────────────────
const realSearchApi = {
  search: async (query: string, lat?: number, lng?: number): Promise<SearchResults> => {
    let url = `/search?q=${encodeURIComponent(query)}`;
    if (lat != null && lng != null) url += `&lat=${lat}&lng=${lng}`;
    const { data } = await api.get(url);
    return unwrap<SearchResults>(data);
  },
};


export const searchApi = realSearchApi;

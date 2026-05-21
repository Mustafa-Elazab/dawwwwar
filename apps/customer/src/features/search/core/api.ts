import type { Merchant, Product, Category } from '@dawwar/types';
import { searchApi as searchService } from '../../../core/api/services';

export interface SearchResults {
  merchants: Merchant[];
  products: Product[];
  categories: Category[];
  query: string;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realSearchApi = {
  search: async (query: string, lat?: number, lng?: number): Promise<SearchResults> =>
    searchService.search(query, lat, lng),
};

export const searchApi = realSearchApi;

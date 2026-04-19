import { delay } from '@dawwar/mocks';
import { mockMerchants, mockProducts, mockCategories } from '@dawwar/mocks';
import type { Merchant, Product, Category } from '@dawwar/types';

export interface SearchResults {
  merchants: Merchant[];
  products: Product[];
  categories: Category[];
  query: string;
}

export const searchApi = {
  search: async (query: string): Promise<SearchResults> => {
    await delay(300); // fast search — feels live

    if (!query.trim()) {
      return { merchants: [], products: [], categories: [], query };
    }

    const q = query.toLowerCase().trim();

    const merchants = mockMerchants.filter(
      (m) =>
        m.businessName.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );

    const products = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nameAr.includes(q) ||
        (p.description ?? '').toLowerCase().includes(q),
    );

    const categories = mockCategories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAr.includes(q),
    );

    return { merchants, products, categories, query };
  },
};

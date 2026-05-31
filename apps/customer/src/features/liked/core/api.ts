import api from '../../../core/api/client';
import type { Product } from '@dawwar/types';

export interface FavoriteProduct {
  id: string;
  productId: string;
  product: Product;
  createdAt: string;
}

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export const likedApi = {
  getFavorites: async (): Promise<FavoriteProduct[]> => {
    const { data } = await api.get('/favorites/products');
    return unwrap<FavoriteProduct[]>(data);
  },
  addFavorite: async (productId: string): Promise<FavoriteProduct> => {
    const { data } = await api.post('/favorites/products', { productId });
    return unwrap<FavoriteProduct>(data);
  },
  removeFavorite: async (productId: string): Promise<void> => {
    await api.delete(`/favorites/products/${productId}`);
  },
};

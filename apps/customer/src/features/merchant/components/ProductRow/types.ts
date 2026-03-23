import type { Product } from '@dawwar/types';

export interface ProductRowProps {
  product: Product;
  quantity: number;   // 0 if not in cart
  onAdd: () => void;
  onRemove: () => void;
}

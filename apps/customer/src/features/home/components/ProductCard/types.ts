import type { Product } from '@dawwar/types';

export interface ProductCardProps {
  product: Product;
  merchantName?: string;
  onAdd: () => void;
}

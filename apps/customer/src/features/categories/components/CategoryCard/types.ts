import type { Category } from '@dawwar/types';

export interface CategoryCardProps {
  category: Category;
  merchantCount?: number;
  onPress: () => void;
}

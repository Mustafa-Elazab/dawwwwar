import type { ModifierGroup, ProductVariant } from '@dawwar/types';

export interface CreateProductDto {
  name: string;
  nameAr: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  isAvailable: boolean;
  categoryId: string;
  isFeatured: boolean;
  modifierGroups?: ModifierGroup[];
  variants?: ProductVariant[];
}

export interface UpdateProductDto {
  name?: string;
  nameAr?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  images?: string[];
  isAvailable?: boolean;
  categoryId?: string;
  isFeatured?: boolean;
  modifierGroups?: ModifierGroup[];
  variants?: ProductVariant[];
}

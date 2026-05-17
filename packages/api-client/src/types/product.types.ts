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
}

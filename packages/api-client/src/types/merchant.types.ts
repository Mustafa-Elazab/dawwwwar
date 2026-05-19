export interface CreateMerchantDto {
  businessName: string;
  parentCategoryId: string;
  categoryIds?: string[];
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  governorate?: string;
}

export interface UpdateMerchantDto {
  businessName?: string;
  parentCategoryId?: string;
  categoryIds?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
}

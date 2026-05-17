export interface CreateMerchantDto {
  businessName: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface UpdateMerchantDto {
  businessName?: string;
  category?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
}

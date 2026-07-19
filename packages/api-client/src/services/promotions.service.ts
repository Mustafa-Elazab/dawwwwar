import { AxiosInstance } from 'axios';
import type { ApiResponse } from '@dawwar/types';

export type PromotionDiscountType = 'PERCENT' | 'FIXED';

export interface PromoCode {
  id: string;
  code: string;
  discountType: PromotionDiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  usedCount?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidatePromoPayload {
  code: string;
  orderAmount: number;
}

export interface ValidatePromoResult {
  valid: boolean;
  discountAmount: number;
  promoCode?: PromoCode;
  error?: string;
}

export class PromotionsService {
  constructor(private client: AxiosInstance) {}

  async validatePromo(
    payload: ValidatePromoPayload,
  ): Promise<ApiResponse<ValidatePromoResult> | ValidatePromoResult> {
    const { data } = await this.client.post('/checkout/validate-promo', payload);
    return data;
  }
}

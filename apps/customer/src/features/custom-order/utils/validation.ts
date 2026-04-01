export interface CustomOrderDraft {
  shopAddress: string;
  shopLatitude: number;
  shopLongitude: number;
  shopName?: string;
  textDescription: string;
  voiceUri: string | null;
  photos: string[];
  estimatedBudget: string;
  paymentMethod: 'CASH' | 'WALLET';
}

export interface ValidationErrors {
  shopAddress?: string;
  items?: string;
  budget?: string;
  payment?: string;
}

const CASH_LIMIT_EGP = 200;

export function validateCustomOrder(
  draft: CustomOrderDraft,
  t: (key: string, opts?: Record<string, unknown>) => string,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!draft.shopAddress.trim()) {
    errors.shopAddress = t('custom_order.shop_address_required');
  }

  const hasText = draft.textDescription.trim().length > 0;
  const hasVoice = draft.voiceUri !== null;
  const hasPhotos = draft.photos.length > 0;
  if (!hasText && !hasVoice && !hasPhotos) {
    errors.items = t('custom_order.items_required');
  }

  const budget = parseFloat(draft.estimatedBudget);
  if (!draft.estimatedBudget || isNaN(budget) || budget <= 0) {
    errors.budget = t('custom_order.budget_required');
  } else if (budget > CASH_LIMIT_EGP && draft.paymentMethod === 'CASH') {
    errors.payment = t('custom_order.budget_cash_limit');
  }

  return errors;
}

export const CASH_LIMIT = CASH_LIMIT_EGP;

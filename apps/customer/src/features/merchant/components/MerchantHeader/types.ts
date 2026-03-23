import type { Merchant } from '@dawwar/types';

export interface MerchantHeaderProps {
  merchant: Merchant;
  onBack: () => void;
}

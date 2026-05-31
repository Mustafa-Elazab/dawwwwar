import type { Merchant } from '@dawwar/types';

export interface MerchantCardProps {
  merchant: Merchant;
  onPress: () => void;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

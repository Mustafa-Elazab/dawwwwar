import React from 'react';
import { Avatar, Badge, ListItem } from '@dawwar/ui';
import type { Merchant } from '@dawwar/types';

interface MerchantListRowProps {
  merchant: Merchant;
  openLabel: string;
  closedLabel: string;
  minutesLabel: string;
  onPress: (merchantId: string) => void;
}

export function MerchantListRow({
  merchant,
  openLabel,
  closedLabel,
  minutesLabel,
  onPress,
}: MerchantListRowProps) {
  return (
    <ListItem
      title={merchant.businessName}
      subtitle={`★ ${Number(merchant.rating || 0).toFixed(1)}  ·  ${merchant.deliveryTimeMin}–${merchant.deliveryTimeMax} ${minutesLabel}`}
      leftElement={<Avatar uri={merchant.logo} name={merchant.businessName} size="md" />}
      rightElement={
        <Badge
          label={merchant.isOpen ? openLabel : closedLabel}
          variant={merchant.isOpen ? 'success' : 'error'}
          size="sm"
        />
      }
      onPress={() => onPress(merchant.id)}
    />
  );
}

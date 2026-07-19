import React from 'react';
import type { AppColors } from '@dawwar/theme';
import type { EarnPromotionAction } from '../useController';
import type { createStyles } from '../styles';
import { EarnPromotionRow } from './EarnPromotionRow';

interface GetMorePromotionsContentProps {
  actions: EarnPromotionAction[];
  isRTL: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onActionPress: (action: EarnPromotionAction) => void;
}

export function GetMorePromotionsContent({
  actions,
  isRTL,
  colors,
  styles,
  onActionPress,
}: GetMorePromotionsContentProps) {
  return (
    <>
      {actions.map((action) => (
        <EarnPromotionRow
          key={action.id}
          action={action}
          isRTL={isRTL}
          colors={colors}
          styles={styles}
          onPress={onActionPress}
        />
      ))}
    </>
  );
}

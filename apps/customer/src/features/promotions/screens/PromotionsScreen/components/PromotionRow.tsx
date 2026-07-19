import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { PromotionItem } from '../useController';
import type { createStyles } from '../styles';

interface PromotionRowProps {
  promotion: PromotionItem;
  selected: boolean;
  disabled: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onToggle?: (promotion: PromotionItem) => void;
  onInfo: (promotion: PromotionItem) => void;
}

export function PromotionRow({
  promotion,
  selected,
  disabled,
  colors,
  styles,
  onToggle,
  onInfo,
}: PromotionRowProps) {
  return (
    <Pressable
      style={[styles.promoRow, disabled ? styles.promoRowDisabled : null]}
      onPress={() => {
        if (disabled) return;
        if (onToggle) {
          onToggle(promotion);
          return;
        }
        onInfo(promotion);
      }}
      accessibilityRole="button"
    >
      <Icon name="ticket-percent" size={22} color={colors.warning} />
      <Text style={styles.promoTitle} numberOfLines={1}>
        {promotion.title}
      </Text>
      <Pressable
        style={styles.promoInfoButton}
        onPress={() => onInfo(promotion)}
        accessibilityRole="button"
      >
        <Icon name="help" size={14} color={colors.primaryText} />
      </Pressable>
      <View style={[styles.checkBox, selected ? styles.checkBoxSelected : null]}>
        {selected ? <Icon name="check" size={16} color={colors.primaryText} /> : null}
      </View>
    </Pressable>
  );
}

import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { EarnPromotionAction } from '../useController';
import type { createStyles } from '../styles';

interface EarnPromotionRowProps {
  action: EarnPromotionAction;
  isRTL: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onPress: (action: EarnPromotionAction) => void;
}

export function EarnPromotionRow({
  action,
  isRTL,
  colors,
  styles,
  onPress,
}: EarnPromotionRowProps) {
  return (
    <Pressable style={styles.earnRow} onPress={() => onPress(action)} accessibilityRole="button">
      <View style={styles.earnIcon}>
        <Icon name={action.icon} size={24} color={colors.warning} />
      </View>
      <Text style={styles.earnTitle} numberOfLines={1}>
        {action.title}
      </Text>
      <Icon name={isRTL ? 'chevron-left' : 'chevron-right'} size={28} color={colors.textDisabled} />
    </Pressable>
  );
}

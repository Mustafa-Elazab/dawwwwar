import React from 'react';
import { Pressable, View } from 'react-native';
import { Icon, Text } from '@dawwar/ui';
import type { AppColors } from '@dawwar/theme';
import type { createStyles } from '../styles';

interface GetMorePromotionsHeaderProps {
  title: string;
  isRTL: boolean;
  colors: AppColors;
  styles: ReturnType<typeof createStyles>;
  onBack: () => void;
}

export function GetMorePromotionsHeader({
  title,
  isRTL,
  colors,
  styles,
  onBack,
}: GetMorePromotionsHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.headerAction} onPress={onBack} accessibilityRole="button">
        <Icon name={isRTL ? 'chevron-right' : 'chevron-left'} size={28} color={colors.text} />
      </Pressable>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={[styles.headerAction, styles.headerActionGhost]} pointerEvents="none" />
    </View>
  );
}

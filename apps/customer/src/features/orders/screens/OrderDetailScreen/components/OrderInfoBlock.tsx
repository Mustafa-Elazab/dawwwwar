import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';
import type { OrderInfoBlockView } from '../useController';

interface OrderInfoBlockProps {
  colors: AppColors;
  isRTL: boolean;
  block: OrderInfoBlockView;
}

export function OrderInfoBlock({ colors, isRTL, block }: OrderInfoBlockProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.infoBlock}>
      <Icon name={block.icon} size={18} color={colors.primary} />
      <View style={styles.infoTextBlock}>
        <Text style={styles.infoTitle}>{block.title}</Text>
        <Text style={styles.infoValue}>{block.value}</Text>
      </View>
    </View>
  );
}

import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface OrderReasonBoxProps {
  colors: AppColors;
  isRTL: boolean;
  title: string;
  reason: string;
}

export function OrderReasonBox({ colors, isRTL, title, reason }: OrderReasonBoxProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.reasonBox}>
      <Text style={styles.reasonTitle}>{title}</Text>
      <Text style={styles.reasonText}>{reason}</Text>
    </View>
  );
}

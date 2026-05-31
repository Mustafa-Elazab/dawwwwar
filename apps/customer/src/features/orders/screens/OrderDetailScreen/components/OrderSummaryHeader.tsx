import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from '../styles';

interface OrderSummaryHeaderProps {
  colors: AppColors;
  isRTL: boolean;
  title: string;
  status?: {
    label: string;
    color: string;
    backgroundColor: string;
  };
}

export function OrderSummaryHeader({
  colors,
  isRTL,
  title,
  status,
}: OrderSummaryHeaderProps) {
  const styles = createStyles(colors, isRTL);

  return (
    <View style={styles.summaryHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {status ? (
        <View style={[styles.statusPill, { backgroundColor: status.backgroundColor }]}>
          <Text style={[styles.statusText, { color: status.color }]}>
            {status.label}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

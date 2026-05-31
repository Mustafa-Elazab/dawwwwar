import React from 'react';
import { View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Text } from '@dawwar/ui';
import { createStyles } from '../styles';
import type { OrderMoneyRowView } from '../useController';

interface OrderTotalsSectionProps {
  colors: AppColors;
  isRTL: boolean;
  rows: OrderMoneyRowView[];
}

export function OrderTotalsSection({ colors, isRTL, rows }: OrderTotalsSectionProps) {
  const styles = createStyles(colors, isRTL);

  if (rows.length === 0) return null;

  return (
    <View style={styles.section}>
      {rows.map((row, index) => (
        <React.Fragment key={row.label}>
          {row.strong && index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.moneyRow}>
            <Text style={row.strong ? styles.moneyLabelStrong : styles.moneyLabel}>
              {row.label}
            </Text>
            <Text style={row.strong ? styles.moneyValueStrong : styles.moneyValue}>
              {row.value}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

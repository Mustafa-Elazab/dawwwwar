import React from 'react';
import { StyleSheet, View } from 'react-native';
import { spacing } from '@dawwar/theme';
import { AppText } from '../../atoms';

export interface PriceRowProps {
  label: string;
  value: string;
  strong?: boolean;
}

export function PriceRow({ label, value, strong }: PriceRowProps) {
  return (
    <View style={styles.row}>
      <AppText variant={strong ? 'body1' : 'body2'}>{label}</AppText>
      <AppText variant={strong ? 'h4' : 'label'}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing[4],
  },
});

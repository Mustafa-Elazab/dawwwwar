import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius, spacing } from '@dawwar/theme';
import { AppIcon, AppPressable, AppText } from '../../atoms';

export interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  testID?: string;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  testID,
}: QuantityStepperProps) {
  const { colors } = useTheme();
  const decrementDisabled = value <= min;

  return (
    <View style={styles.row} testID={testID}>
      <AppPressable
        style={[styles.button, { backgroundColor: colors.surfaceVariant }]}
        onPress={onDecrement}
        disabled={decrementDisabled}
      >
        <AppIcon name="minus" size={18} color={decrementDisabled ? colors.textDisabled : colors.text} />
      </AppPressable>
      <AppText variant="label" style={styles.value}>{String(value)}</AppText>
      <AppPressable
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onIncrement}
      >
        <AppIcon name="plus" size={18} color={colors.primaryText} />
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 24,
    textAlign: 'center',
  },
});

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { BadgeProps } from './types';

export function Badge({
  label,
  variant = 'neutral',
  size = 'md',
  dot = false,
  style,
  testID,
}: BadgeProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (dot) {
    return (
      <View
        style={[styles.base, styles.dot, styles[`dot${variant.charAt(0).toUpperCase()}${variant.slice(1)}` as keyof typeof styles], style]}
        testID={testID}
      />
    );
  }

  const variantKey = variant.charAt(0).toUpperCase() + variant.slice(1);

  return (
    <View
      style={[styles.base, styles[size], styles[variant], style]}
      testID={testID}
    >
      <Text style={styles[`label${variantKey}` as keyof typeof styles]}>
        {label}
      </Text>
    </View>
  );
}

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { ChipProps } from './types';

export function Chip({
  label,
  selected = false,
  onPress,
  onDismiss,
  disabled = false,
  style,
  testID,
}: ChipProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors, selected);

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      <Text style={styles.label}>{label}</Text>
      {onDismiss && (
        <Text style={styles.dismiss} onPress={onDismiss}>×</Text>
      )}
    </TouchableOpacity>
  );
}

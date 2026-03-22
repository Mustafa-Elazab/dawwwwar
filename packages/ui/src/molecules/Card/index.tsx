import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { createStyles } from './styles';
import type { CardProps } from './types';

export function Card({
  variant = 'elevated',
  onPress,
  children,
  style,
  testID,
  disabled = false,
}: CardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const containerStyle = [styles.base, styles[variant], disabled && styles.disabled, style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={containerStyle} testID={testID}>{children}</View>;
}

import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text } from '../Text';
import { createStyles } from './styles';
import type { ButtonProps } from './types';

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  testID,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isDisabled = disabled || loading;

  const labelStyleKey = `label${variant.charAt(0).toUpperCase()}${variant.slice(1)}` as
    | 'labelPrimary'
    | 'labelSecondary'
    | 'labelOutline'
    | 'labelGhost'
    | 'labelDanger';

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger'
            ? colors.primaryText
            : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[styles[labelStyleKey], styles[`label${size.charAt(0).toUpperCase()}${size.slice(1)}` as 'labelSm' | 'labelMd' | 'labelLg']]}>{label}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}

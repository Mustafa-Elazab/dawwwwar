import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, radius, space, typography } from '@dawwar/theme';
import { Text } from '../../../../../packages/ui/src/atoms/Text';

type DriverButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type DriverButtonSize = 'sm' | 'md' | 'lg';

interface DriverButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: DriverButtonVariant;
  size?: DriverButtonSize;
  style?: StyleProp<ViewStyle>;
}

export function DriverButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  fullWidth = false,
  variant = 'primary',
  size = 'md',
  style,
}: DriverButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const isFilled = variant === 'primary' || variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        fullWidth && styles.fullWidth,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'secondary' && { backgroundColor: colors.surfaceVariant },
        variant === 'outline' && {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          borderWidth: 1.5,
        },
        variant === 'ghost' && { backgroundColor: 'transparent' },
        variant === 'danger' && { backgroundColor: colors.error },
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isFilled ? colors.primaryText : colors.primary} />
      ) : (
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            styles[`label${size.charAt(0).toUpperCase()}${size.slice(1)}` as 'labelSm' | 'labelMd' | 'labelLg'],
            { color: isFilled ? colors.primaryText : variant === 'secondary' ? colors.text : colors.primary },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 88,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  sm: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  md: {
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    minHeight: 52,
  },
  lg: {
    paddingHorizontal: space.xl,
    paddingVertical: space.base,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.button,
    flexShrink: 1,
    textAlign: 'center',
  },
  labelSm: typography.buttonSm,
  labelMd: typography.button,
  labelLg: typography.button,
});

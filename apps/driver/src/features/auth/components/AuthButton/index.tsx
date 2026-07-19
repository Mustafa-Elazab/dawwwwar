import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTheme, radius, space, typography } from '@dawwar/theme';
import { Text } from '../../../../../../../packages/ui/src/atoms/Text';

interface AuthButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: object;
}

export function AuthButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: AuthButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'outline' && { borderColor: colors.primary, borderWidth: 1.5 },
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.primaryText : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: variant === 'primary' ? colors.primaryText : colors.primary },
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
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    width: '100%',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.button,
    textAlign: 'center',
  },
});

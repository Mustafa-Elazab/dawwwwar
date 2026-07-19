import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // Base touchable
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.md,
      gap: space.sm,
      minWidth: 88,
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.5 },

    // Variants
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: colors.error,
      borderWidth: 0,
    },

    // Sizes
    sm: { paddingHorizontal: space.md, paddingVertical: space.sm },
    md: { paddingHorizontal: space.lg, paddingVertical: space.md },
    lg: { paddingHorizontal: space.xl, paddingVertical: space.base },

    // Label colors per variant
    labelPrimary: { ...typography.button, color: colors.primaryText, flexShrink: 1, textAlign: 'center' },
    labelSecondary: { ...typography.button, color: colors.text, flexShrink: 1, textAlign: 'center' },
    labelOutline: { ...typography.button, color: colors.primary, flexShrink: 1, textAlign: 'center' },
    labelGhost: { ...typography.button, color: colors.primary, flexShrink: 1, textAlign: 'center' },
    labelDanger: { ...typography.button, color: colors.primaryText, flexShrink: 1, textAlign: 'center' },

    // Size label overrides
    labelSm: typography.buttonSm,
    labelMd: typography.button,
    labelLg: typography.button,
  });

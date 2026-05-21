import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // Base touchable
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.button,
      gap: space.sm,
      overflow: 'hidden',
    },
    fullWidth: { width: '100%' },
    disabled: { opacity: 0.45 },

    // Variants
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 0,
      ...shadows.sm,
      shadowColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
    danger: {
      backgroundColor: colors.error,
      borderWidth: 0,
      ...shadows.sm,
      shadowColor: colors.error,
    },

    // Sizes — more generous padding for premium feel
    sm: { paddingHorizontal: space.base, paddingVertical: space.sm, minHeight: 36 },
    md: { paddingHorizontal: space.xl, paddingVertical: space.md, minHeight: 48 },
    lg: { paddingHorizontal: space['2xl'], paddingVertical: space.base, minHeight: 56 },

    // Label colors per variant
    labelPrimary: { ...typography.button, color: colors.primaryText },
    labelSecondary: { ...typography.button, color: colors.text },
    labelOutline: { ...typography.button, color: colors.text },
    labelGhost: { ...typography.button, color: colors.primary },
    labelDanger: { ...typography.button, color: colors.primaryText },

    // Size label overrides
    labelSm: typography.buttonSm,
    labelMd: typography.button,
    labelLg: typography.button,

    spinnerWrap: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      start: 0,
      end: 0,
    },
  });

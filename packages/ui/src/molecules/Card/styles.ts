import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      overflow: 'hidden',
    },
    pressable: {
      width: '100%',
    },
    elevated: {
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    flat: {
      backgroundColor: colors.surface,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.none,
    },
    disabled: { opacity: 0.5 },
  });


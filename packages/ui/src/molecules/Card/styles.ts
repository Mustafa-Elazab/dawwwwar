import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.lg,
      backgroundColor: colors.card,
      overflow: 'hidden',
    },
    elevated: { ...shadows.md },
    flat: { backgroundColor: colors.surface },
    outlined: {
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.none,
    },
    disabled: { opacity: 0.6 },
  });

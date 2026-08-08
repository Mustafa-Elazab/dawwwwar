import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      padding: spacing[1],
      // On iOS, overflow: 'hidden' clips shadows. 
      // We need to keep it visible for premium feel.
    },
    pressable: {
      width: '100%',
      // If content needs rounding, apply it to the children or use a wrapper.
    },
    elevated: { ...shadows.md },
    flat: { backgroundColor: colors.surface },
    outlined: {
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.sm,
    },
    disabled: { opacity: 0.6 },
  });

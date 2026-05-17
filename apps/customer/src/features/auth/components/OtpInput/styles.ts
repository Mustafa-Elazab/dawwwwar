import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, hasError?: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center', // Center boxes
      alignItems: 'center',
      gap: space.sm, // Even spacing
      width: '100%',
    },
    box: {
      width: 50, // Wider boxes
      height: 60,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: hasError ? colors.error : colors.border,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    boxFilled: {
      borderColor: colors.primary,
    },
    boxFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
      ...shadows.md, // Elevated shadow on active box
      elevation: 4,
    },
    digit: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    hiddenInput: {
      position: 'absolute',
      width: 0,
      height: 0,
      opacity: 0,
    },
  });

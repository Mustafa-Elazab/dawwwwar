import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, hasError: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: space.sm,
    },
    box: {
      width: 48,
      height: 56,
      borderRadius: radius.md,
      borderWidth: 2,
      borderColor: hasError ? colors.error : colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    boxFilled: {
      borderColor: hasError ? colors.error : colors.primary,
      backgroundColor: hasError ? colors.errorBg : colors.primaryMuted,
    },
    digit: {
      ...typography.h3,
      color: hasError ? colors.error : colors.text,
      textAlign: 'center',
    },
    // Hidden real TextInput layered over each box
    hiddenInput: {
      position: 'absolute',
      opacity: 0,
      width: '100%',
      height: '100%',
    },
  });

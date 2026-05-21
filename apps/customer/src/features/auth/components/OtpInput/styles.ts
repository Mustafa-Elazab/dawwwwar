import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space } from '@dawwar/theme';

export const createStyles = (colors: AppColors, hasError?: boolean) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: space.md,
      width: '100%',
    },
    box: {
      width: 52,
      height: 56,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: hasError ? colors.error : colors.border,
      backgroundColor: '#1A1A1A',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      fontSize: 24,
      fontWeight: '700',
      color: '#F5F5F5',
      paddingVertical: 0,
    },
    boxFilled: {
      borderColor: colors.primary,
    },
    boxFocused: {
      borderColor: colors.primary,
      borderWidth: 1.5,
    },
  });

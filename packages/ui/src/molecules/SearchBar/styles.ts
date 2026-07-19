import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.full,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      gap: space.sm,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      textAlign: 'auto',
      paddingVertical: 0,   // remove default Android padding
    },
    clearButton: { padding: space.xs },
  });

import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.full,
      paddingHorizontal: space.md,
      paddingVertical: space[2],
      gap: space.sm,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      paddingVertical: 0,   // remove default Android padding
    },
    clearButton: { padding: space[1] },
  });

import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.base,
      gap: space.md,
      backgroundColor: colors.card,
    },
    leftElement: { flexShrink: 0 },
    content: {
      flex: 1,
      gap: space.xs,
      alignItems: 'flex-start',
    },
    title: {
      ...typography.body1,
      color: colors.text,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    rightElement: { flexShrink: 0 },
    chevron: { color: colors.textDisabled },
    disabled: { opacity: 0.5 },
  });

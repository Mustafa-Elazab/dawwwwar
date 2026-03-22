import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.base,
      gap: space.md,
      backgroundColor: colors.card,
    },
    left: { flexShrink: 0 },
    content: {
      flex: 1,
      gap: space[1],
      alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    },
    title: {
      ...typography.body1,
      color: colors.text,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    right: { flexShrink: 0 },
    chevron: { color: colors.textDisabled },
    disabled: { opacity: 0.5 },
  });

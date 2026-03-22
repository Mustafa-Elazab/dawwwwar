import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: { gap: space.xs },
    label: {
      ...typography.label,
      color: colors.textSecondary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    inputRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      backgroundColor: colors.surface,
      borderColor: hasError
        ? colors.error
        : isFocused
        ? colors.borderFocus
        : colors.border,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      paddingVertical: space.md,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    iconContainer: { paddingHorizontal: space.xs },
    error: {
      ...typography.caption,
      color: colors.error,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    hint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    multiline: { minHeight: 100, textAlignVertical: 'top' },
    disabled: { opacity: 0.6, backgroundColor: colors.surfaceVariant },
  });

import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: {
      gap: space.xs,
    },
    inputWrapper: {
      marginTop: space.md, // Make space for floating label
    },
    labelFloating: {
      position: 'absolute',
      left: space.md,
      top: space.md,
      zIndex: 1,
    },
    inputRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      backgroundColor: colors.surface,
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
      marginTop: space.xxs,
    },
    hint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      marginTop: space.xxs,
    },
    multiline: { minHeight: 100, textAlignVertical: 'top' },
    disabled: { opacity: 0.6, backgroundColor: colors.surfaceVariant },
  });

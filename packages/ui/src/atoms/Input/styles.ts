import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isFocused: boolean, hasError: boolean) =>
  StyleSheet.create({
    container: {
      gap: space.xs,
    },
    inputWrapper: {
      marginTop: space.md,
    },
    labelFloating: {
      position: 'absolute',
      start: space.md,
      top: space.md,
      zIndex: 1,
    },
    labelText: {
      ...typography.label,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.input,
      paddingHorizontal: space.md,
      backgroundColor: colors.surfaceVariant,
      minHeight: 52,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      paddingVertical: space.md,
      textAlign: 'auto',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    iconContainer: { paddingHorizontal: space.xs },
    error: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'auto',
      marginTop: space.xxs,
      paddingStart: space.xs,
    },
    hint: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'auto',
      marginTop: space.xxs,
      paddingStart: space.xs,
    },
    multiline: { minHeight: 100, textAlignVertical: 'top' },
    disabled: { opacity: 0.5, backgroundColor: colors.surfaceVariant },
  });

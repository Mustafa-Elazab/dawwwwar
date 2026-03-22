import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    base: {
      color: colors.text,
      // RTL: writingDirection mirrors text for Arabic characters
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
    // Pre-built variant overrides (color applied separately via prop)
    h1: typography.h1,
    h2: typography.h2,
    h3: typography.h3,
    h4: typography.h4,
    body1: typography.body1,
    body2: typography.body2,
    caption: typography.caption,
    label: typography.label,
    button: typography.button,
    buttonSm: typography.buttonSm,
    overline: typography.overline,
  });

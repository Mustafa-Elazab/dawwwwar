import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, shadows, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, transparent: boolean) =>
  StyleSheet.create({
    container: {
      height: 56,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: space.sm,
      backgroundColor: transparent ? 'transparent' : colors.card,
      ...(transparent ? {} : shadows.sm),
      borderBottomWidth: transparent ? 0 : 1,
      borderBottomColor: colors.border,
    },
    actionBtn: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 22,
    },
    titleContainer: { flex: 1, alignItems: 'center' },
    title: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'center',
    },
  });

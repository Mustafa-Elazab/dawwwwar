import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    bar: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.primary,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      ...shadows.lg,
    },
    leftText: { ...typography.label, color: '#fff' },
    rightText: { ...typography.label, color: '#fff', fontWeight: '700' },
  });

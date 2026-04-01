import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isOnline: boolean) =>
  StyleSheet.create({
    container: {
      margin: space.base,
      borderRadius: radius['2xl'],
      padding: space.xl,
      alignItems: 'center',
      gap: space.sm,
      backgroundColor: isOnline ? colors.successBg : colors.surfaceVariant,
      borderWidth: 2,
      borderColor: isOnline ? colors.success : colors.border,
    },
    statusDot: {
      width: 12, height: 12, borderRadius: 6,
      backgroundColor: isOnline ? colors.success : colors.textDisabled,
    },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
    statusText: {
      ...typography.h3,
      color: isOnline ? colors.success : colors.textSecondary,
      fontWeight: '700',
    },
    subtitleText: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    toggleBtn: {
      marginTop: space.sm,
      paddingHorizontal: space['2xl'],
      paddingVertical: space.md,
      borderRadius: radius.full,
      backgroundColor: isOnline ? colors.error : colors.primary,
    },
    toggleBtnText: {
      ...typography.button,
      color: '#fff',
      fontWeight: '700',
    },
  });

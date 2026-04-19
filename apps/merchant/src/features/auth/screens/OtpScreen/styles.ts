import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: space.base,
      paddingTop: space['2xl'],
    },
    backButton: {
      marginBottom: space.xl,
      alignSelf: 'flex-start',
    },
    title: {
      ...typography.h2,
      color: colors.text,
      marginBottom: space.sm,
    },
    subtitle: {
      ...typography.body1,
      color: colors.textSecondary,
      marginBottom: space['2xl'],
      lineHeight: 24,
    },
    phoneHighlight: {
      color: colors.primary,
      fontWeight: '600',
    },
    otpWrapper: {
      marginBottom: space.xl,
    },
    errorText: {
      ...typography.body2,
      color: colors.error,
      textAlign: 'center',
      marginTop: space.md,
    },
    timerRow: {
      alignItems: 'center',
      marginBottom: space.xl,
    },
    timerText: {
      ...typography.label,
      color: colors.textSecondary,
    },
    resendButton: {
      alignItems: 'center',
      paddingVertical: space.sm,
    },
    resendActive: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '600',
    },
    resendDisabled: {
      ...typography.label,
      color: colors.textDisabled,
    },
    loadingRow: {
      alignItems: 'center',
      marginTop: space.md,
    },
  });

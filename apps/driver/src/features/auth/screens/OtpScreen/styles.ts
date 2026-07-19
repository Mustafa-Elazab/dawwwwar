import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: space.xl,
      justifyContent: 'center',
      paddingTop: '10%',
      paddingBottom: '20%',
    },
    header: {
      alignItems: 'center',
      marginBottom: space['2xl'],
    },
    subtitle: {
      ...typography.body1,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    phoneHighlight: {
      color: colors.primary,
      fontWeight: '700',
    },
    otpWrapper: {
      marginBottom: space['2xl'],
    },
    errorText: {
      ...typography.body2,
      color: colors.error,
      textAlign: 'center',
      marginTop: space.md,
      fontWeight: '600',
    },
    timerContainer: {
      alignItems: 'center',
      marginBottom: space.xl,
    },
    circleTimer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      ...shadows.sm,
    },
    circleTimerExpired: {
      borderColor: colors.error,
    },
    timerValue: {
      ...typography.h4,
      color: colors.primary,
      fontWeight: '700',
    },
    timerValueExpired: {
      color: colors.error,
    },
    resendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      marginTop: space.lg,
      flexWrap: 'wrap',
    },
    resendText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    resendBtn: {
      paddingVertical: space.xs,
    },
    resendActive: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
      textDecorationLine: 'underline',
    },
    resendDisabled: {
      ...typography.label,
      color: colors.textDisabled,
    },
    bottomAction: {
      padding: space.xl,
      backgroundColor: colors.background,
    },
    confirmBtn: {
      height: 56,
      borderRadius: radius.lg,
    },
    hintText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      marginTop: space.md,
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, layout, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: layout.screenPaddingH + 6,
      justifyContent: 'center',
      paddingTop: '8%',
      paddingBottom: '20%',
    },
    header: {
      alignItems: 'center',
      marginBottom: space['2xl'],
    },
    title: {
      ...typography.h2,
      color: colors.text,
      marginBottom: space.sm,
      fontWeight: '700',
    },
    subtitle: {
      ...typography.body1,
      color: '#A0A0A0',
      textAlign: 'center',
      lineHeight: 24,
    },
    phoneHighlight: {
      color: colors.primary,
      fontWeight: '700',
    },
    otpWrapper: {
      marginBottom: space['2xl'],
      paddingVertical: space.lg,
      paddingHorizontal: space.md,
      borderRadius: radius.lg,
      backgroundColor: '#0D0D0D',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.08)',
      ...shadows.xs,
    },
    errorText: {
      ...typography.body2,
      color: colors.error,
      textAlign: 'center',
      marginTop: space.md,
      fontWeight: '600',
    },
    
    // ── Timer & Resend ──────────────────────────────────
    timerContainer: {
      alignItems: 'center',
      marginBottom: space.xl,
    },
    circleTimerWrap: {
      width: 72,
      height: 72,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerValue: {
      ...typography.label,
      position: 'absolute',
      color: '#F5F5F5',
      fontSize: 16,
      fontWeight: '700',
    },
    
    resendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      marginTop: space.lg,
    },
    resendText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    resendBtn: {
      paddingVertical: space.xs,
      paddingHorizontal: space.xs,
    },
    resendActive: {
      ...typography.label,
      color: '#1DB954',
      fontWeight: '700',
    },
    resendDisabled: {
      ...typography.label,
      color: '#606060',
    },

    // ── Bottom ────────────────────────────────────────────
    bottomAction: {
      paddingHorizontal: layout.screenPaddingH + 6,
      paddingVertical: space.lg,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    confirmBtn: {
      minHeight: 52,
      borderRadius: radius.xl,
    },
    loadingRow: {
      position: 'absolute',
      top: '50%',
      start: '50%',
      marginStart: -10,
      marginTop: -10,
    },
    hintText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      marginTop: space.md,
    },
  });

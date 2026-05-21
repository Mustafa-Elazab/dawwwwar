import { StyleSheet, Dimensions } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

const { height } = Dimensions.get('window');

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // ── Layout ──────────────────────────────────────────
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    atmosphere: {
      ...StyleSheet.absoluteFillObject,
    },
    orbPrimary: {
      position: 'absolute',
      top: -140,
      start: -100,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: colors.primary,
      opacity: 0.14,
    },
    orbSecondary: {
      position: 'absolute',
      bottom: -180,
      end: -120,
      width: 360,
      height: 360,
      borderRadius: 180,
      backgroundColor: colors.surfaceVariant,
      opacity: 0.2,
    },
    hero: {
      height: height * 0.4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: space['2xl'],
      gap: space.sm,
    },
    logoShell: {
      width: 128,
      height: 128,
      borderRadius: 64,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      borderWidth: 0,
      ...shadows.sm,
    },
    logoText: {
      ...typography.display,
      color: '#F5F5F5',
      fontWeight: '800',
      letterSpacing: -0.8,
    },
    tagline: {
      ...typography.caption,
      color: colors.primary,
      marginTop: space.xs,
      fontSize: 14,
      fontWeight: '600',
    },
    taglineRtl: {
      letterSpacing: 0,
      textTransform: 'none',
    },

    // ── Form Card ───────────────────────────────────────
    card: {
      flex: 1,
      backgroundColor: '#1A1A1A',
      borderTopStartRadius: 32,
      borderTopEndRadius: 32,
      paddingHorizontal: 24,
      paddingTop: 32,
      paddingBottom: space.xl,
      borderTopWidth: 1,
      borderColor: colors.borderLight,
    },

    // ── Form Content ────────────────────────────────────
    formTitle: {
      ...typography.h3,
      color: '#F5F5F5',
      fontSize: 22,
      marginBottom: space.xs,
      fontWeight: '700',
    },
    formSubtitle: {
      ...typography.body2,
      color: '#A0A0A0',
      fontSize: 14,
      marginBottom: space.lg,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: 14,
      borderColor: colors.border,
      backgroundColor: '#1F1F1F',
      marginBottom: space.md,
      height: 54,
      paddingHorizontal: space.xs,
      gap: space.xs,
    },
    phoneRowFocused: {
      borderColor: 'rgba(29,185,84,0.5)',
    },
    phoneRowError: {
      borderColor: '#EF4444',
    },
    countryPrefix: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: space.md,
      borderRadius: 10,
      backgroundColor: '#242424',
      gap: space.sm,
      height: 38,
    },
    prefixFlag: {
      fontSize: 20,
    },
    prefixCode: {
      ...typography.label,
      color: colors.text,
      fontWeight: '700',
    },
    phoneInput: {
      flex: 1,
      ...typography.body1,
      color: '#F5F5F5',
      paddingHorizontal: space.md,
      height: '100%',
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginBottom: space.sm,
      paddingStart: space.xs,
    },

    // ── Terms ────────────────────────────────────────────
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: space.xl,
      gap: space.sm,
      paddingHorizontal: 2,
    },
    checkboxContainer: {
      padding: space.xs,
      margin: -space.xs,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: radius.sm,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      flexShrink: 0,
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    termsText: {
      flex: 1,
      ...typography.caption,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: '700',
    },

    // ── Bottom ────────────────────────────────────────────
    spacer: { flex: 1 },
    sendButton: {
      minHeight: 52,
      borderRadius: radius.xl,
      marginBottom: space.md,
    },
    sendButtonDisabled: {
      backgroundColor: '#242424',
    },
    termsHint: {
      ...typography.caption,
      color: colors.error,
      textAlign: 'center',
      marginTop: space.sm,
    },
    hintText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      opacity: 0.7,
    },
  });

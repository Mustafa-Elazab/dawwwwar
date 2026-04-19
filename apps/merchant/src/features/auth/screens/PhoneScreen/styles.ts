import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    // ── Outer layout ────────────────────────────────────
    container: {
      flex: 1,
      paddingHorizontal: space.base,
      paddingTop: space['3xl'],
      paddingBottom: space.xl,
    },
    logoArea: {
      alignItems: 'center',
      marginBottom: space['2xl'],
    },
    logoText: {
      ...typography.h1,
      color: colors.primary,
      fontWeight: '800',
    },
    tagline: {
      ...typography.body2,
      color: colors.textSecondary,
      marginTop: space.sm,
      textAlign: 'center',
    },

    // ── Form ────────────────────────────────────────────
    formTitle: {
      ...typography.h3,
      color: colors.text,
      marginBottom: space.xl,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    phoneRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderRadius: radius.md,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      marginBottom: space.md,
    },
    phoneRowError: {
      borderColor: colors.error,
    },
    countryPrefix: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      borderEndWidth: 1,
      borderStartWidth: 0,
      borderColor: colors.border,
      gap: space.sm,
    },
    prefixFlag: {
      fontSize: 20,
    },
    prefixCode: {
      ...typography.label,
      color: colors.text,
    },
    phoneInput: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      paddingHorizontal: space.md,
      paddingVertical: space.md,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    errorText: {
      ...typography.caption,
      color: colors.error,
      marginBottom: space.md,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    // ── Terms ────────────────────────────────────────────
    termsRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      marginBottom: space.xl,
      gap: space.sm,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
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
      textAlign: I18nManager.isRTL ? 'right' : 'left',
      lineHeight: 18,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: '600',
    },

    // ── Bottom ────────────────────────────────────────────
    spacer: { flex: 1 },
    sendButton: { marginBottom: space.md },
    hintText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
    },
  });

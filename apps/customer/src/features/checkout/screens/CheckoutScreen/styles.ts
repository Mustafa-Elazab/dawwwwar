import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      backgroundColor: colors.surface,
      marginBottom: space.sm,
      ...shadows.xs,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space.md,
    },
    sectionTitle: {
      ...typography.overline,
      color: colors.textSecondary,
      fontWeight: '800',
      letterSpacing: 1,
    },
    
    // ── Address ────────────────────────────────────────
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    addressLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
      marginBottom: 2,
    },
    addressText: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'auto',
    },

    // ── Payment ────────────────────────────────────────
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.borderLight,
      marginBottom: space.sm,
      gap: space.md,
    },
    paymentOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '10',
    },
    paymentIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paymentInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    paymentLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '700',
    },
    paymentSub: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    paymentError: {
      ...typography.caption,
      color: colors.error,
      marginTop: 4,
      fontWeight: '600',
    },

    // ── Notes ──────────────────────────────────────────
    notesHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space.sm,
    },
    charCount: {
      ...typography.caption,
      color: colors.textTertiary,
    },

    // ── Summary ────────────────────────────────────────
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: space['2xl'],
    },
    summaryLabel: {
      ...typography.body1,
      color: colors.textSecondary,
    },
    summaryValue: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
    },
    totalLabel: {
      ...typography.h3,
      color: colors.text,
      fontWeight: '800',
    },
    totalValue: {
      ...typography.h3,
      color: colors.primary,
      fontWeight: '900',
    },

    // ── Footer ─────────────────────────────────────────
    footer: {
      padding: space.base,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      ...shadows.lg,
    },
    placeOrderBtn: {
      height: 56,
      borderRadius: radius.xl,
    },
  });

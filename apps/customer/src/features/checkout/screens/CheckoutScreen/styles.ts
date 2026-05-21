import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.base,
      backgroundColor: colors.surface,
      marginBottom: space.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space.md,
    },
    sectionTitle: {
      ...typography.overline,
      color: colors.textTertiary,
      fontWeight: '700',
      letterSpacing: 1,
    },

    // ── Address ────────────────────────────────────────
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addressLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '700',
      marginBottom: 2,
    },
    addressText: {
      ...typography.body2,
      color: colors.textSecondary,
    },

    // ── Payment ────────────────────────────────────────
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: space.md,
      borderRadius: radius.xl,
      borderWidth: 1.5,
      borderColor: colors.borderLight,
      marginBottom: space.sm,
      gap: space.md,
      ...shadows.xs,
    },
    paymentOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    paymentIconWrap: {
      width: 44,
      height: 44,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    paymentInfo: {
      flex: 1,
      alignItems: 'flex-start',
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    paymentLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
    },
    paymentSub: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    paymentError: {
      ...typography.caption,
      color: colors.error,
      marginTop: space.xxs,
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
      paddingVertical: space.sm,
    },
    summaryLabel: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    summaryValue: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '600',
    },
    totalLabel: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '800',
    },
    totalValue: {
      ...typography.h4,
      color: colors.primary,
      fontWeight: '800',
    },

    // ── Footer ─────────────────────────────────────────
    footer: {
      padding: layout.screenPaddingH,
      paddingBottom: space.xl,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    placeOrderBtn: {
      minHeight: 52,
      borderRadius: radius.xl,
    },
  });

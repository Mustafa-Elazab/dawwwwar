import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginVertical: space.sm,
    },
    scrollContent: {
      paddingHorizontal: space.base,
      paddingBottom: 40,
    },
    list: { flexGrow: 0 }, // Prevent list from expanding too much if few items

    // ── Promo Code ──────────────────────────────────────
    promoWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.md,
      paddingHorizontal: space.md,
      height: 48,
      marginVertical: space.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    promoInput: {
      flex: 1,
      ...typography.body2,
      color: colors.text,
    },
    promoBtn: {
      color: colors.primary,
      fontWeight: '800',
      paddingHorizontal: space.sm,
    },

    // ── Summary ─────────────────────────────────────────
    summary: {
      padding: space.base,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
      gap: space.xs,
      paddingBottom: 40,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    summaryLabel: { ...typography.body2, color: colors.textSecondary },
    summaryValue: { ...typography.body1, color: colors.text, fontWeight: '700' },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: 4,
    },
    totalRow: {
      marginTop: space.xs,
    },
    totalLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '800',
      fontSize: 18,
    },
    totalValue: {
      ...typography.h3,
      color: colors.primary,
      fontWeight: '900',
      fontSize: 22,
    },

    // ── Bottom Action ───────────────────────────────────
    footer: {
      paddingHorizontal: space.xl,
      paddingBottom: space.xl,
      backgroundColor: colors.surface,
    },
    checkoutBtn: {
      minHeight: 52,
      borderRadius: radius.xl,
    },
  });

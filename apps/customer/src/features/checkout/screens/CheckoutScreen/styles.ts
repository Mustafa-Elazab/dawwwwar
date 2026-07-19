import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      padding: space.base,
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
      ...typography.body1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'auto',
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
      borderRadius: 22,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addressLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
    },
    addressText: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'auto',
    },

    // ── Payment ────────────────────────────────────────
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      gap: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    paymentInfo: {
      flex: 1,
      alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
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
      fontWeight: '700',
      textAlign: 'auto',
    },
    paymentSub: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'auto',
    },
    selectedPaymentLabel: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '800',
      maxWidth: 160,
      textAlign: 'auto',
    },
    paymentError: {
      ...typography.caption,
      color: colors.error,
      marginTop: 2,
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
      color: colors.textSecondary,
    },

    // ── Summary ────────────────────────────────────────
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 4,
    },
    summaryLabel: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'auto',
    },
    summaryValue: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '600',
      textAlign: 'auto',
    },
    deliveryFeeValue: {
      alignItems: I18nManager.isRTL ? 'flex-start' : 'flex-end',
    },
    totalLabel: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '900',
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
    },
    placeOrderBtn: {
      height: 56,
      borderRadius: radius.lg,
      ...shadows.md,
    },
  });

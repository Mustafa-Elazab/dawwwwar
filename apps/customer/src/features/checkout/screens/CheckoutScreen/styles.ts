import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.card,
      marginBottom: space.sm,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
    },
    sectionTitle: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: space.md,
    },
    addressRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    addressLabel: { ...typography.label, color: colors.primary },
    addressText: { ...typography.body1, color: colors.text, marginTop: 2 },
    paymentOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
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
    radioSelected: { borderColor: colors.primary },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    paymentLabel: { ...typography.label, color: colors.text },
    paymentSub: { ...typography.caption, color: colors.textSecondary },
    paymentError: { ...typography.caption, color: colors.error, marginTop: 2 },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: space.sm,
    },
    summaryLabel: { ...typography.body2, color: colors.textSecondary },
    summaryValue: { ...typography.body2, color: colors.text },
    totalLabel: { ...typography.label, color: colors.text, fontWeight: '700' },
    totalValue: { ...typography.h4, color: colors.primary, fontWeight: '700' },
    placeOrderBtn: {
      marginHorizontal: space.base,
      marginVertical: space.md,
    },
  });

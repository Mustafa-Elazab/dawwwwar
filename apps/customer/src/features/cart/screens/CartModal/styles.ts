import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    sheet: { flex: 1, backgroundColor: colors.card },
    handle: {
      width: 40,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginTop: space.md,
      marginBottom: space.base,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: space.base,
      paddingBottom: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { ...typography.h3, color: colors.text },
    closeBtn: { padding: space.sm },
    list: { flex: 1, paddingHorizontal: space.base },
    summary: {
      paddingHorizontal: space.base,
      paddingTop: space.md,
      paddingBottom: space.xl,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: space.sm,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    summaryLabel: { ...typography.body2, color: colors.textSecondary },
    summaryValue: { ...typography.body2, color: colors.text },
    totalLabel: { ...typography.label, color: colors.text, fontWeight: '700' },
    totalValue: { ...typography.label, color: colors.primary, fontWeight: '700' },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: space.sm,
    },
    checkoutBtn: { marginTop: space.sm },
  });

import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.base,
      gap: space.md,
      borderBottomWidth: 1, borderBottomColor: colors.borderLight,
    },
    iconCircle: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    creditCircle: { backgroundColor: colors.successBg },
    debitCircle: { backgroundColor: colors.errorBg },
    info: { flex: 1 },
    reason: { ...typography.label, color: colors.text },
    date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    amountCol: { alignItems: 'flex-end' },
    amountCredit: { ...typography.label, color: colors.success, fontWeight: '700' },
    amountDebit: { ...typography.label, color: colors.error, fontWeight: '700' },
    balanceAfter: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  });

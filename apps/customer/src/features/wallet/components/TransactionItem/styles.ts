import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.md,
      gap: space.md,
      backgroundColor: colors.surface,
      marginHorizontal: 0,
      marginBottom: space.sm,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    creditCircle: { backgroundColor: colors.successBg },
    debitCircle: { backgroundColor: colors.errorBg },
    info: { flex: 1, gap: 2 },
    reason: { ...typography.label, color: colors.text, fontWeight: '600' },
    date: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    amountCol: { alignItems: 'flex-end' },
    amountCredit: { ...typography.label, color: colors.success, fontWeight: '700' },
    amountDebit: { ...typography.label, color: colors.error, fontWeight: '700' },
    balanceAfter: { ...typography.caption, color: colors.textDisabled, marginTop: 2 },
  });

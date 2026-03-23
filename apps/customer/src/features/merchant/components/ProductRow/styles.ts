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
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    image: { width: 72, height: 72, borderRadius: radius.md },
    info: { flex: 1 },
    name: { ...typography.label, color: colors.text },
    description: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
    price: { ...typography.label, color: colors.primary, marginTop: 4 },
    unavailableBadge: { marginTop: 4 },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    stepperBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperBtnMinus: {
      backgroundColor: colors.surfaceVariant,
    },
    stepperCount: {
      ...typography.label,
      color: colors.text,
      minWidth: 20,
      textAlign: 'center',
    },
    addBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

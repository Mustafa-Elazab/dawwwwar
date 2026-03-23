import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.md,
      paddingVertical: space.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    image: { width: 60, height: 60, borderRadius: radius.md },
    info: { flex: 1, gap: 4 },
    name: { ...typography.label, color: colors.text },
    price: { ...typography.body2, color: colors.primary, fontWeight: '600' },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    stepBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    stepBtnActive: { borderColor: colors.primary },
    count: {
      ...typography.label,
      color: colors.text,
      minWidth: 24,
      textAlign: 'center',
    },
  });

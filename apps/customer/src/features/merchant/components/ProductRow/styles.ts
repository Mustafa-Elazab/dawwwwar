import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      padding: space.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: space.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
      alignItems: 'center',
      gap: space.md,
      marginHorizontal: space.base,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },
    info: {
      flex: 1,
      gap: 4,
      alignItems: 'flex-start',
    },
    name: {
      ...typography.label,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'left',
    },
    description: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'left',
    },
    price: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '800',
    },
    unavailableBadge: { marginTop: 4 },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
    },
    stepperBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperBtnMinus: {
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    stepperCount: {
      ...typography.label,
      minWidth: 20,
      textAlign: 'center',
    },
    addBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
  });

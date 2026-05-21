import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, layout, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      padding: space.md,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      marginBottom: space.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
      alignItems: 'center',
      gap: space.md,
      marginHorizontal: layout.screenPaddingH,
      ...shadows.xs,
    },
    image: {
      width: 76,
      height: 76,
      borderRadius: radius.lg,
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
      fontWeight: '600',
    },
    description: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    price: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '700',
    },
    unavailableBadge: { marginTop: 4 },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    stepperBtn: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xs,
      shadowColor: colors.primary,
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
      width: 34,
      height: 34,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xs,
      shadowColor: colors.primary,
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      paddingVertical: space.md,
      paddingHorizontal: space.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: radius.lg,
      backgroundColor: colors.background,
    },
    info: {
      flex: 1,
      gap: 2,
      alignItems: 'flex-start',
    },
    name: {
      ...typography.label,
      color: colors.text,
      fontWeight: '600',
    },
    merchantName: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    price: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: '700',
    },
    stepper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
      backgroundColor: colors.background,
      borderRadius: radius.full,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    stepBtn: {
      width: 30,
      height: 30,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    count: {
      ...typography.label,
      color: colors.text,
      minWidth: 26,
      textAlign: 'center',
      fontWeight: '700',
    },
  });

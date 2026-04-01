import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    userCard: {
      alignItems: 'center',
      padding: space.xl,
      backgroundColor: colors.card,
      marginBottom: space.sm,
      gap: space.sm,
    },
    userName: { ...typography.h3, color: colors.text },
    userPhone: { ...typography.body2, color: colors.textSecondary },
    sectionLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
    },
    sectionCard: {
      backgroundColor: colors.card,
      marginBottom: space.sm,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    versionText: {
      ...typography.caption,
      color: colors.textDisabled,
      textAlign: 'center',
      padding: space.xl,
    },
    logoutRow: { backgroundColor: colors.card, marginBottom: space.sm },
  });

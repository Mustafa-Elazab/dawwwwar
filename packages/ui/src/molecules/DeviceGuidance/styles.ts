import { StyleSheet } from 'react-native';
import { AppColors, space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      padding: space.base,
      backgroundColor: colors.card,
      borderStartWidth: 4,
      borderStartColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: space.sm,
    },
    iconContainer: {
      marginEnd: space.sm,
    },
    title: {
      flex: 1,
      ...typography.label,
      color: colors.text,
      fontWeight: 'bold',
    },
    body: {
      ...typography.body2,
      color: colors.textSecondary,
      marginBottom: space.md,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.xs,
    },
    actionText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: 'bold',
      marginEnd: space.xs,
    },
  });

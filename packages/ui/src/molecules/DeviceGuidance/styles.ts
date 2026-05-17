import { StyleSheet } from 'react-native';
import { AppColors, space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      padding: space.base,
      backgroundColor: colors.card,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: space.sm,
    },
    iconContainer: {
      marginRight: space.sm,
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
      marginRight: space.xs,
    },
  });

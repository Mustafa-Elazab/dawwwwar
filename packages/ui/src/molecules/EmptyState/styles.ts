import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: space.xl,
      gap: space.md,
    },
    title: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    actionButton: { marginTop: space.sm },
  });

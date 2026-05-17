import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: space['2xl'],
      gap: space.md,
      paddingVertical: space['3xl'],
    },
    visualContainer: {
      marginBottom: space.lg,
    },
    image: {
      width: 180,
      height: 180,
      marginBottom: space.lg,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    title: {
      ...typography.h3,
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.body1,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    actionButton: { 
      marginTop: space.lg,
      minWidth: 160,
    },
  });

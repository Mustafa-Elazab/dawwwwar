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
      marginBottom: space.md,
    },
    image: {
      width: 200,
      height: 200,
      marginBottom: space.md,
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: radius.full,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.md,
    },
    title: {
      color: colors.text,
      textAlign: 'center',
      fontWeight: '800',
    },
    subtitle: {
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: space.lg,
    },
    actionButton: { 
      marginTop: space.lg,
      minWidth: 180,
    },
  });

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
      gap: space.base,
      paddingVertical: space['3xl'],
    },
    visualContainer: {
      marginBottom: space.sm,
    },
    image: {
      width: 180,
      height: 180,
      marginBottom: space.sm,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.sm,
    },
    title: {
      color: colors.text,
      textAlign: 'center',
      fontWeight: '700',
    },
    subtitle: {
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: space.base,
    },
    actionButton: {
      marginTop: space.md,
      minWidth: 160,
    },
  });

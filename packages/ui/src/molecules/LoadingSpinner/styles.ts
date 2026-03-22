import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    fullscreen: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    inline: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: space.base,
    },
    message: {
      ...typography.body2,
      color: colors.textSecondary,
      marginTop: space.sm,
      textAlign: 'center',
    },
  });

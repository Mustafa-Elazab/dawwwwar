import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    banner: {
      backgroundColor: colors.error,
      paddingVertical: space[2],
      paddingHorizontal: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
    },
    text: {
      ...typography.label,
      color: '#FFFFFF',
    },
  });

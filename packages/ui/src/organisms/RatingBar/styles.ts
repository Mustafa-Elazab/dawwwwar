import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
    },
    value: {
      ...typography.label,
      color: colors.text,
      marginStart: space.sm,
    },
  });

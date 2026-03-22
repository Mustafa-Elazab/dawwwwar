import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: space.base,
      marginBottom: space.lg,
    },
    item: {
      alignItems: 'center',
      gap: space.sm,
      flex: 1,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    customCircle: { backgroundColor: colors.primary },
    regularCircle: { backgroundColor: colors.surfaceVariant },
    label: {
      ...typography.caption,
      color: colors.text,
      textAlign: 'center',
      fontWeight: '500',
    },
  });

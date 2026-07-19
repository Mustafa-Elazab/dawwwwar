import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.background,
    },
    mapContainer: {
      width: '100%',
      overflow: 'hidden',
      backgroundColor: colors.surfaceVariant,
    },
    content: {
      flex: 1,
      backgroundColor: colors.background,
    },
    footer: {
      backgroundColor: colors.background,
    },
  });

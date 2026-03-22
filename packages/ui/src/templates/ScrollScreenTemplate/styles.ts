import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: space.xl,
    },
  });

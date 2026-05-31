import { StyleSheet } from 'react-native';
import { AppColors, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: spacing[4],
    },
    rootTransparent: {
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
    },
    header: {
      borderBottomWidth: 0,
      paddingBottom: spacing[2],
    },
    searchSlot: {
      paddingHorizontal: spacing[4],
      paddingTop: spacing[2],
    },
  });

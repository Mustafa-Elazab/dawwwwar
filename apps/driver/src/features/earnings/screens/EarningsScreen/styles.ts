import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    sectionTitle: {
      ...typography.h4, color: colors.text,
      paddingHorizontal: space.base,
      paddingTop: space.base, paddingBottom: space.sm,
    },
  });

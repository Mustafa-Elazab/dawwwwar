import { StyleSheet } from 'react-native';
import { AppColors, space } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: space.lg,
      backgroundColor: colors.background,
    },
    form: {
      flex: 1,
      marginTop: space.xl,
    },
    spacer: {
      height: space.xl,
    },
  });

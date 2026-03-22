import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    handle: {
      backgroundColor: colors.border,
      width: 40,
      height: 4,
      borderRadius: radius.full,
      alignSelf: 'center',
      marginTop: 8,
    },
    background: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radius['2xl'],
      borderTopRightRadius: radius['2xl'],
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    list: { flex: 1 },
    columnWrapper: { gap: space.sm, paddingHorizontal: space.base },
  });

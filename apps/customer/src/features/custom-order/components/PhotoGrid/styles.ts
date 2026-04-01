import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
    cell: {
      width: 80, height: 80,
      borderRadius: radius.md,
      overflow: 'hidden',
      position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    removeBtn: {
      position: 'absolute', top: 2, right: 2,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 10, width: 20, height: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    addCell: {
      width: 80, height: 80,
      borderRadius: radius.md,
      borderWidth: 1.5, borderStyle: 'dashed',
      borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
      gap: space.sm,
    },
    addText: { fontSize: 10, color: colors.textSecondary },
  });

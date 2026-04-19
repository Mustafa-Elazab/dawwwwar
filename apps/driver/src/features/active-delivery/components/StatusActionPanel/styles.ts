import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    panel: {
      backgroundColor: colors.card,
      padding: space.base,
      gap: space.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      ...shadows.lg,
    },
    row: { flexDirection: 'row', gap: space.sm },
    halfBtn: { flex: 1 },
  });

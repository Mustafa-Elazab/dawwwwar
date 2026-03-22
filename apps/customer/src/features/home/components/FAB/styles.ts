import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: space.xl,
      right: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      paddingHorizontal: space.base,
      paddingVertical: space.md,
      gap: space.sm,
      ...shadows.lg,
    },
    label: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 14,
    },
  });

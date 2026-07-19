import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom: space.xl + 65, // Positioned above bottom tab bar
      end: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: space.lg,
      paddingVertical: space.md,
      borderRadius: radius.full,
      ...shadows.lg,
      elevation: 6,
      gap: space.xs,
    },
    label: {
      ...typography.label,
      color: '#fff',
      fontWeight: '800',
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      aspectRatio: 1,
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      ...shadows.sm,
      margin: space.sm,
    },
    emoji: { fontSize: 36 },
    name: {
      ...typography.label,
      color: colors.text,
      textAlign: 'center',
    },
    count: {
      ...typography.caption,
      color: colors.textSecondary,
    },
  });

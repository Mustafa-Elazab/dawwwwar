import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      aspectRatio: 0.9,
      borderRadius: radius.lg,
      margin: 6, // Reduced margin for 3 columns
      alignItems: 'center',
      justifyContent: 'center',
      padding: space.sm,
      borderWidth: 1.5,
      ...shadows.xs,
    },
    iconCircle: {
      width: 56, // 64x64 centered requested, using 56 for 3 columns fit
      height: 56,
      borderRadius: radius.full,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: space.sm,
    },
    emoji: {
      fontSize: 28,
    },
    name: {
      ...typography.caption,
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    count: {
      ...typography.overline,
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

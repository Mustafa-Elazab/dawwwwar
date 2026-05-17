import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      aspectRatio: 0.9,
      borderRadius: 16,
      margin: 6, // Reduced margin for 3 columns
      alignItems: 'center',
      justifyContent: 'center',
      padding: space.sm,
      borderWidth: 1.5,
    },
    iconCircle: {
      width: 56, // 64x64 centered requested, using 56 for 3 columns fit
      height: 56,
      borderRadius: 28,
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

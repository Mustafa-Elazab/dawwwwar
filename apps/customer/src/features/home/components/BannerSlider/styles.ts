import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: space.md },
    banner: {
      width: '100%',
      aspectRatio: 16 / 6,
      borderRadius: radius['2xl'],
      backgroundColor: colors.primaryMuted,
      overflow: 'hidden',
      marginEnd: space.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.sm,
    },
    bannerImage: { width: '100%', height: '100%' },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: space.xs,
      marginTop: space.md,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#606060',
    },
    dotActive: {
      width: 18,
      backgroundColor: '#1DB954',
      borderRadius: 3,
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { marginBottom: space.lg },
    banner: {
      width: 320,
      height: 140,
      borderRadius: radius.xl,
      backgroundColor: colors.primaryMuted,
      overflow: 'hidden',
      marginRight: space.md,
    },
    bannerImage: { width: '100%', height: '100%' },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: space.sm,
      marginTop: space.sm,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
    },
    dotActive: { width: 18, backgroundColor: colors.primary },
  });

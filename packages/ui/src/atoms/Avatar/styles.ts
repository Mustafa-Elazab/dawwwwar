import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, typography } from '@dawwar/theme';

const SIZES = { xs: 24, sm: 32, md: 48, lg: 64, xl: 96 } as const;

export const createStyles = (colors: AppColors, size: keyof typeof SIZES) => {
  const dim = SIZES[size];
  return StyleSheet.create({
    container: {
      width: dim,
      height: dim,
      borderRadius: radius.full,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: { width: dim, height: dim, borderRadius: radius.full },
    initials: {
      ...typography.label,
      color: colors.primary,
      fontSize: dim * 0.35,
      fontWeight: '700',
    },
  });
};

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      margin: space.base,
      borderRadius: radius['2xl'],
      backgroundColor: colors.primary,
      padding: space.xl,
      alignItems: 'center',
      gap: space.sm,
      ...shadows.lg,
    },
    label: { ...typography.label, color: 'rgba(255,255,255,0.8)' },
    amount: { ...typography.h1, color: '#fff', fontWeight: '800', textAlign: 'center' },
  });

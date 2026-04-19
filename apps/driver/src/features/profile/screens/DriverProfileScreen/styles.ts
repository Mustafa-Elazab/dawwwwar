import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      alignItems: 'center', padding: space.xl,
      backgroundColor: colors.card, marginBottom: space.sm,
      gap: space.sm,
    },
    name: { ...typography.h3, color: colors.text },
    role: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
    ratingText: { ...typography.label, color: colors.warning, fontWeight: '700' },
    section: {
      backgroundColor: colors.card, marginBottom: space.sm,
      borderRadius: radius.lg, overflow: 'hidden',
    },
    sectionLabel: {
      ...typography.caption, color: colors.textSecondary,
      textTransform: 'uppercase', letterSpacing: 0.8,
      paddingHorizontal: space.base,
      paddingTop: space.base, paddingBottom: space.sm,
    },
  });

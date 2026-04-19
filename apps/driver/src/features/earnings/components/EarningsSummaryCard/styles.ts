import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      margin: space.base,
      borderRadius: radius['2xl'],
      padding: space.xl,
      backgroundColor: colors.primary,
      ...shadows.lg,
    },
    dateLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginBottom: space.md },
    gridRow: { flexDirection: 'row', gap: space.md },
    kpiBox: {
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: radius.lg,
      padding: space.md,
      gap: 4,
    },
    kpiValue: { ...typography.h3, color: '#fff', fontWeight: '800' },
    kpiLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
    warningBanner: {
      flexDirection: 'row', alignItems: 'center', gap: space.sm,
      backgroundColor: colors.warningBg,
      borderRadius: radius.md,
      padding: space.sm,
      marginTop: space.sm,
    },
    warningText: { ...typography.caption, color: colors.warning, flex: 1 },
  });

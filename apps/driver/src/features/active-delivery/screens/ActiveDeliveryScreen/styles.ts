import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    orderCard: {
      backgroundColor: colors.card,
      margin: space.base,
      borderRadius: radius.xl,
      padding: space.base,
      ...shadows.sm,
    },
    orderNum: { ...typography.label, color: colors.textSecondary },
    merchantName: { ...typography.h4, color: colors.text, marginTop: 4 },
    statusBadgeRow: {
      flexDirection: 'row',
      gap: space.sm,
      marginTop: space.sm,
    },
  });

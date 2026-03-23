import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    infoTab: {
      padding: space.base,
      gap: space.md,
    },
    infoRow: {
      gap: space.sm,
    },
    infoLabel: {
      ...typography.label,
      color: colors.textSecondary,
    },
    infoValue: {
      ...typography.body1,
      color: colors.text,
    },
    hoursTable: { gap: space.sm },
    hoursRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    reviewsPlaceholder: {
      padding: space.xl,
      alignItems: 'center',
    },
    bottomPad: { height: 80 },
  });

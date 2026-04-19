import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      width: 180,
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      marginEnd: space.md,
      overflow: 'hidden',
      ...shadows.md,
    },
    cover: { width: '100%', height: 100 },
    body: { padding: space.sm },
    name: {
      ...typography.label,
      color: colors.text,
      marginBottom: 2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      flexWrap: 'wrap',
    },
    metaText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    ratingText: {
      ...typography.caption,
      color: colors.warning,
      fontWeight: '600',
    },
    badgeWrapper: {
      position: 'absolute',
      top: space.sm,
      end: space.sm,
    },
  });

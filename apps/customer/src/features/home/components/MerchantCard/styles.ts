import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.sm,
    },
    coverContainer: {
      height: 120,
      width: '100%',
      position: 'relative',
    },
    cover: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      height: '40%',
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    badgeOverlay: {
      position: 'absolute',
      top: 8,
      start: 8,
    },
    likeButton: {
      position: 'absolute',
      top: 8,
      end: 8,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    body: {
      padding: space.sm,
    },
    name: {
      ...typography.body1,
      fontSize: 15,
      color: colors.text,
      fontWeight: '800',
      marginBottom: 2,
      textAlign: 'auto',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    ratingText: {
      ...typography.caption,
      color: colors.warning,
      fontWeight: '800',
    },
    metaText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
  });

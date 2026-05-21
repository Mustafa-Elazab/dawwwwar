import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      height: 220,
      borderRadius: radius.xl,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.sm,
    },
    coverContainer: {
      height: 122,
      width: '100%',
      position: 'relative',
    },
    cover: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
    },
    scrimTop: {
      position: 'absolute',
      top: 0,
      start: 0,
      end: 0,
      height: 50,
      backgroundColor: 'transparent',
      // subtle top scrim for badge readability
      opacity: 0.4,
    },
    scrimBottom: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      height: 50,
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
    badgeOverlay: {
      position: 'absolute',
      top: space.sm,
      start: space.sm,
      borderRadius: radius.full,
      paddingHorizontal: space.sm,
      paddingVertical: 4,
    },
    openBadge: {
      backgroundColor: 'rgba(29,185,84,0.9)',
    },
    closedBadge: {
      backgroundColor: 'rgba(239,68,68,0.85)',
    },
    statusLabel: {
      ...typography.caption,
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    deliveryPill: {
      position: 'absolute',
      bottom: space.sm,
      end: space.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: space.sm,
      paddingVertical: 3,
      borderRadius: radius.full,
    },
    deliveryPillText: {
      ...typography.caption,
      fontSize: 11,
      color: '#fff',
      fontWeight: '700',
    },
    body: {
      padding: space.md,
      gap: space.xs,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: space.sm,
    },
    name: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '700',
      flex: 1,
    },
    ratingChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: colors.warningBg,
      paddingHorizontal: space.sm,
      paddingVertical: 2,
      borderRadius: radius.full,
    },
    ratingText: {
      ...typography.caption,
      fontSize: 11,
      color: colors.warning,
      fontWeight: '800',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: colors.textTertiary,
    },
    metaText: {
      ...typography.caption,
      color: colors.textSecondary,
      fontSize: 12,
    },
    feeText: {
      ...typography.caption,
      color: '#1DB954',
      fontSize: 12,
      fontWeight: '700',
    },
  });

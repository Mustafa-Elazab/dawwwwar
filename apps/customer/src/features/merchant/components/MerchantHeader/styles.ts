import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { typography, space, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    coverContainer: {
      height: 260,
      width: '100%',
      position: 'relative',
      backgroundColor: colors.surfaceVariant,
    },
    cover: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surfaceVariant,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.12)',
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      height: 140,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    topControls: {
      position: 'absolute',
      top: 0,
      start: 0,
      end: 0,
      paddingHorizontal: space.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    controlButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: 'rgba(10,10,10,0.52)',
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.xs,
    },
    headerContent: {
      position: 'absolute',
      bottom: 0,
      start: 0,
      end: 0,
      padding: space.lg,
    },
    businessName: {
      ...typography.heading,
      color: '#fff',
      marginBottom: space.xs,
      fontWeight: '800',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: space.md,
      gap: space.sm,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
      paddingHorizontal: space.sm,
      paddingVertical: 3,
      borderRadius: radius.full,
      gap: 4,
    },
    ratingText: {
      ...typography.label,
      color: '#fff',
      fontWeight: '700',
    },
    metaText: {
      ...typography.body2,
      color: 'rgba(255,255,255,0.85)',
    },
    badgeWrapper: {
      alignSelf: 'flex-start',
    },
  });

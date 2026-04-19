import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    coverContainer: { height: 220, position: 'relative' },
    cover: { width: '100%', height: '100%' },
    backBtn: {
      position: 'absolute',
      top: space.md,
      start: space.md,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoCard: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radius['2xl'],
      borderTopRightRadius: radius['2xl'],
      marginTop: -24,
      paddingHorizontal: space.base,
      paddingTop: space.lg,
      paddingBottom: space.md,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      marginBottom: space.sm,
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: radius.lg,
    },
    nameBlock: { flex: 1 },
    businessName: {
      ...typography.h3,
      color: colors.text,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      flexWrap: 'wrap',
      marginTop: 4,
    },
    metaText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    ratingText: {
      ...typography.caption,
      color: colors.warning,
      fontWeight: '700',
    },
    closedText: {
      ...typography.caption,
      color: colors.error,
      fontWeight: '600',
    },
  });

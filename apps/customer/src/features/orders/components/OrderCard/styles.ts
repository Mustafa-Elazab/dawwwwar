import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: space.base,
      marginHorizontal: layout.screenPaddingH,
      marginBottom: space.md,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
      gap: space.md,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderNum: {
      ...typography.label,
      color: colors.text,
      fontWeight: '700',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      flexWrap: 'wrap',
    },
    metaText: { ...typography.caption, color: colors.textSecondary },
    totalText: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
    },
    actionRow: {
      flexDirection: 'row',
      gap: space.sm,
    },
    trackBtn: { flex: 1 },
    detailBtn: { flex: 1 },
  });

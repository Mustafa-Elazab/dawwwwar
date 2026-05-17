import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: space.base,
      marginHorizontal: space.base,
      marginBottom: space.md,
      ...shadows.sm,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: space.sm,
    },
    orderNum: { ...typography.label, color: colors.text },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      marginBottom: space.md,
    },
    metaText: { ...typography.body2, color: colors.textSecondary },
    totalText: { ...typography.label, color: colors.primary },
    actionRow: {
      flexDirection: 'row',
      gap: space.sm,
    },
    trackBtn: { flex: 1 },
    detailBtn: { flex: 1 },
  });

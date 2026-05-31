import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: space.sm,
      marginHorizontal: space.base,
      marginBottom: space.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
      ...shadows.sm,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      gap: space.sm,
    },
    orderNum: { ...typography.caption, color: colors.textSecondary, fontWeight: '800' },
    itemName: {
      ...typography.label,
      color: colors.text,
      fontWeight: '900',
      marginBottom: 6,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    metaText: { ...typography.body2, color: colors.textSecondary },
    totalText: { ...typography.label, color: colors.primary },
    chevron: {
      width: 28,
      alignItems: 'center',
    },
  });

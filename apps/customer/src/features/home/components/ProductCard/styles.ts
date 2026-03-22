import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      borderRadius: radius.xl,
      backgroundColor: colors.card,
      overflow: 'hidden',
      ...shadows.sm,
    },
    image: { width: '100%', height: 130 },
    body: { padding: space.sm },
    name: {
      ...typography.label,
      color: colors.text,
      marginBottom: 2,
    },
    merchantName: {
      ...typography.caption,
      color: colors.textSecondary,
      marginBottom: space.sm,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '700',
    },
    addBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unavailable: { opacity: 0.5 },
  });

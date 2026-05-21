import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: layout.screenPaddingH,
      marginTop: space.base,
      borderRadius: radius['2xl'],
      backgroundColor: colors.primary,
      paddingVertical: space['2xl'],
      paddingHorizontal: space.xl,
      alignItems: 'center',
      gap: space.sm,
      ...shadows.md,
      shadowColor: colors.primary,
    },
    label: {
      ...typography.label,
      color: 'rgba(255,255,255,0.75)',
      letterSpacing: 0.5,
    },
    amount: { ...typography.h1, color: '#fff', fontWeight: '800' },
    currency: {
      ...typography.h4,
      color: 'rgba(255,255,255,0.85)',
      marginBottom: 2,
    },
    amountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
  });

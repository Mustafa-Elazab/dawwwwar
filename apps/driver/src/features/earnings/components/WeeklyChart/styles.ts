import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      marginHorizontal: space.base,
      marginBottom: space.lg,
      backgroundColor: colors.card,
      borderRadius: radius.xl,
      padding: space.base,
    },
    title: { ...typography.h4, color: colors.text, marginBottom: space.md },
    chartRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: space.sm,
      height: 100,
    },
    barCol: { flex: 1, alignItems: 'center', gap: space[1] },
    bar: { width: '80%', borderRadius: radius.sm },
    barToday: {},
    dayLabel: { ...typography.caption, color: colors.textSecondary },
    amountLabel: { ...typography.overline, color: colors.textSecondary },
  });

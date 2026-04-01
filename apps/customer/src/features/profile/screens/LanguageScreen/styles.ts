import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    card: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', margin: space.base },
    optionRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: space.base, paddingVertical: space.lg,
      borderBottomWidth: 1, borderBottomColor: colors.borderLight,
    },
    optionLeft: { flexDirection: 'row', alignItems: 'center', gap: space.md },
    flag: { fontSize: 28 },
    optionLabel: { ...typography.body1, color: colors.text },
    radio: {
      width: 22, height: 22, borderRadius: 11,
      borderWidth: 2, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  });

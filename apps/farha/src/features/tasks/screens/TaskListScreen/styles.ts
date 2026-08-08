import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { spacing } from '@dawwar/theme';
import { createPhase1ScreenStyles } from '../../../planner/utils/styles';

export const createStyles = (colors: AppColors) => {
  const base = createPhase1ScreenStyles(colors);
  return StyleSheet.create({
    ...base,
    centeredToggle: {
      alignSelf: 'center',
      width: '86%',
    },
    paymentBox: {
      padding: spacing[4],
      gap: spacing[3],
      borderRadius: 24,
      backgroundColor: colors.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
  });
};

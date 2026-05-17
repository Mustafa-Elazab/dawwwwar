import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    historyHeader: {
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    divider: {
      height: 8,
      backgroundColor: colors.surfaceVariant,
      marginVertical: space.md,
    },
    historyTitle: { ...typography.h4, color: colors.text,alignSelf:"flex-start" },
    seeAllText: { ...typography.label, color: colors.primary },
  });

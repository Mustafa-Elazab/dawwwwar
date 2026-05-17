import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    tabRow: {
      flexDirection: 'row',
      backgroundColor: colors.surfaceVariant,
      margin: space.base,
      borderRadius: radius.full,
      padding: 3,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: radius.full,
      alignItems: 'center',
    },
    tabActive: { 
      backgroundColor: colors.primary,
    },
    tabLabel: { 
      ...typography.label,
    },
  });

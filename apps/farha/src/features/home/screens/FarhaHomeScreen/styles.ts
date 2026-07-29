import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      gap: spacing[5],
      paddingHorizontal: spacing[5],
      paddingVertical: spacing[6],
    },
    hero: {
      gap: spacing[2],
    },
    card: {
      gap: spacing[4],
    },
    readinessList: {
      gap: spacing[3],
    },
    readinessRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing[3],
    },
    readinessDot: {
      width: spacing[2],
      height: spacing[2],
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      marginTop: spacing[2],
    },
    readinessText: {
      flex: 1,
    },
  });

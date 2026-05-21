import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, layout, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    historyHeader: {
      paddingHorizontal: layout.screenPaddingH,
      paddingTop: space.lg,
      paddingBottom: space.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: space.sm,
      marginHorizontal: layout.screenPaddingH,
    },
    historyCard: {
      marginHorizontal: layout.screenPaddingH,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.borderLight,
      backgroundColor: colors.card,
      overflow: 'hidden',
      ...shadows.xs,
      marginBottom: space.lg,
    },
    historyTitle: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '700',
      alignSelf: 'flex-start',
    },
    seeAllText: {
      ...typography.caption,
      color: colors.primary,
      fontWeight: '700',
    },
  });

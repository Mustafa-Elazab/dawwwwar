import { StyleSheet } from 'react-native';
import { AppColors, radius, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: colors.overlay,
    },
    backdropHitArea: {
      flex: 1,
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radius['2xl'],
      borderTopRightRadius: radius['2xl'],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[3],
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -6 },
      shadowOpacity: 1,
      shadowRadius: 18,
      elevation: 18,
    },
    handle: {
      alignSelf: 'center',
      width: 44,
      height: 4,
      borderRadius: radius.full,
      backgroundColor: colors.border,
      marginBottom: spacing[3],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: spacing[4],
    },
    titleBlock: {
      flex: 1,
      paddingHorizontal: spacing[2],
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceVariant,
    },
    content: {
      flexGrow: 0,
    },
    footer: {
      paddingTop: spacing[4],
      paddingBottom: spacing[2],
    },
  });

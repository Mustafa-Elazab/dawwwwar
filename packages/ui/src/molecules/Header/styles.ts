import { StyleSheet, I18nManager } from 'react-native';
import { AppColors } from '@dawwar/theme';
import { space, typography, radius, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: layout.screenPaddingH,
      backgroundColor: colors.background,
    },
    leftContainer: {
      width: 44,
      justifyContent: 'center',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightContainer: {
      width: 44,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    leftAction: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      ...typography.body1,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 1,
    },
  });

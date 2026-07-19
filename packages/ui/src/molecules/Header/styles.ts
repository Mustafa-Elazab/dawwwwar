import { StyleSheet } from 'react-native';
import { AppColors } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: colors.background,
    },
    leftContainer: {
      width: 40,
      justifyContent: 'center',
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightContainer: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    leftAction: {
      padding: 8,
      marginStart: -8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 2,
    },
  });

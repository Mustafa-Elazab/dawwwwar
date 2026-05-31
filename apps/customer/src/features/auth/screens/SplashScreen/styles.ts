import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    template: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    animatedContent: {
      alignItems: 'center',
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing[6],
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 10,
    },
    brandName: {
      fontSize: 48,
      fontWeight: '900',
      color: colors.primaryText,
      letterSpacing: 0,
      textAlign: 'center',
    },
    version: {
      fontSize: 14,
      color: colors.primaryText,
      marginTop: spacing[3],
      fontWeight: '800',
      textAlign: 'center',
    },
    tagline: {
      fontSize: 18,
      color: colors.primaryText,
      marginTop: 220,
      fontWeight: '500',
      letterSpacing: 0,
      textAlign: 'center',
      opacity: 0.86,
    },
  });

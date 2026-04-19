import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: space.xl,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    logoContainer: {
      marginBottom: space['3xl'],
      alignItems: 'center',
    },
    logoText: {
      ...typography.h1,
      color: colors.primary,
      fontWeight: 'bold',
    },
    welcomeText: {
      ...typography.h2,
      color: colors.text,
      marginBottom: space.sm,
      textAlign: 'center',
    },
    subtitleText: {
      ...typography.body1,
      color: colors.textSecondary,
      marginBottom: space['3xl'],
      textAlign: 'center',
    },
    buttonContainer: {
      width: '100%',
      gap: space.md,
    },
    loginButton: {
      width: '100%',
    },
    signupButton: {
      width: '100%',
    },
  });

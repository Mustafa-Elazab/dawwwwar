import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: space.xl,
      paddingTop: space['3xl'],
      backgroundColor: colors.background,
    },
    title: {
      ...typography.h2,
      color: colors.text,
      marginBottom: space.sm,
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      marginBottom: space['2xl'],
    },
    form: {
      gap: space.md,
    },
    input: {
      marginBottom: space.sm,
    },
    button: {
      marginTop: space.lg,
    },
    footer: {
      marginTop: space['2xl'],
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      ...typography.body2,
      color: colors.textSecondary,
    },
    footerLink: {
      ...typography.body2,
      color: colors.primary,
      fontWeight: 'bold',
      marginStart: space.xs,
    },
  });

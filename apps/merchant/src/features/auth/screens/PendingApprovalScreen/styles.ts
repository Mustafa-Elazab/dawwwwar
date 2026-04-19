import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: space.xl,
      gap: space.lg,
    },
    illustration: { fontSize: 80 },
    title: { ...typography.h2, color: colors.text, textAlign: 'center' },
    body: {
      ...typography.body1,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 26,
    },
    contactBtn: { marginTop: space.md },
    logoutBtn: { marginTop: space.sm },
  });

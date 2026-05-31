import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors, width: number) =>
  StyleSheet.create({
    content: {
      flex: 1,
      paddingTop: spacing[10] * 2,
      paddingBottom: spacing[10],
    },
    slide: {
      width,
      paddingHorizontal: spacing[6] + spacing[1],
    },
    illustration: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: Math.min(width * 0.8, 320),
    },
    copy: {
      alignItems: 'center',
      gap: spacing[3],
      marginBottom: spacing[12],
    },
    title: {
      color: colors.primary,
      fontSize: 22,
      fontWeight: '800',
      textAlign: 'center',
    },
    body: {
      color: colors.primary,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing[2],
      marginBottom: spacing[6] + spacing[1],
    },
    dot: {
      width: spacing[2],
      height: spacing[2],
      borderRadius: spacing[1],
      backgroundColor: `${colors.primary}30`,
    },
    dotActive: {
      width: spacing[6] + spacing[1],
      backgroundColor: colors.primary,
    },
    actions: {
      paddingHorizontal: spacing[6] + spacing[1],
      gap: spacing[2] + spacing[1],
    },
    primaryButton: {
      minHeight: 52,
      borderRadius: 26,
    },
  });

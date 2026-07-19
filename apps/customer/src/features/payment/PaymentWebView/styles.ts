import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, topInset: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      minHeight: topInset + 56,
      paddingTop: topInset + space.sm,
      paddingHorizontal: space.base,
      backgroundColor: colors.background,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    title: {
      ...typography.body1,
      flex: 1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'auto',
    },
    webview: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
      zIndex: 3,
    },
  });

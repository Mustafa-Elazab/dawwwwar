import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      minHeight: 54,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surfaceVariant,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      gap: space.sm,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 1,
      minHeight: 24,
      justifyContent: 'center',
    },
    addressText: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'auto',
    },
    placeholderText: {
      color: colors.textTertiary,
    },
  });

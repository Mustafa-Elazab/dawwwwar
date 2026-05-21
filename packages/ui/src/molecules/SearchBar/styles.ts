import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.xl,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      gap: space.sm,
      minHeight: 44,
    },
    input: {
      flex: 1,
      ...typography.body1,
      color: colors.text,
      paddingVertical: 0,
    },
    clearButton: { padding: space.xs },
  });

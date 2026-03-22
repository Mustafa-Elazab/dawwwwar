import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, selected: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      paddingHorizontal: space.md,
      paddingVertical: space[2],
      borderWidth: 1.5,
      gap: space[1],
      backgroundColor: selected ? colors.primaryMuted : 'transparent',
      borderColor: selected ? colors.primary : colors.border,
    },
    disabled: { opacity: 0.5 },
    label: {
      ...typography.label,
      color: selected ? colors.primary : colors.textSecondary,
    },
    dismiss: {
      ...typography.label,
      color: selected ? colors.primary : colors.textSecondary,
      fontWeight: '700',
    },
  });

import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.base,
      gap: space.md,
      backgroundColor: colors.card,
      minHeight: layout.minTouchTarget,
    },
    leftElement: { flexShrink: 0 },
    content: {
      flex: 1,
      gap: 2,
      alignItems: 'flex-start',
    },
    title: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '500',
    },
    subtitle: {
      ...typography.caption,
      color: colors.textSecondary,
    },
    rightElement: { flexShrink: 0 },
    chevron: { color: colors.textDisabled },
    disabled: { opacity: 0.45 },
  });

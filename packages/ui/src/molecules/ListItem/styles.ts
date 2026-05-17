import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row', // Let RN handle the flip automatically
      alignItems: 'center',
      paddingVertical: space.md,
      paddingHorizontal: space.base,
      gap: space.md,
      backgroundColor: colors.card,
    },
    leftElement: { flexShrink: 0 },
    content: {
      flex: 1,
      gap: space.xs,
      // Use logical alignment or stretch
      alignItems: 'flex-start',
    },
    title: {
      ...typography.body1,
      color: colors.text,
      // textAlign: 'auto' is usually best, but 'left'/'right' in RN are NOT logical.
      // In RTL, we want visual right.
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    subtitle: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },
    rightElement: { flexShrink: 0 },
    chevron: { color: colors.textDisabled },
    disabled: { opacity: 0.5 },
  });

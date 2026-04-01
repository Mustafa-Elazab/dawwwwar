import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: space.base,
      paddingTop: space.base,
      paddingBottom: space.sm,
    },
    headerTitle: { ...typography.h2, color: colors.text },
    offlinePlaceholder: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      padding: space.xl, gap: space.md,
    },
    offlineText: { ...typography.body1, color: colors.textSecondary, textAlign: 'center' },
    listContent: { paddingTop: space.sm, paddingBottom: 24 },
  });

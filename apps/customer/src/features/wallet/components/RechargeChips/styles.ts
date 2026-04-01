import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { paddingHorizontal: space.base, marginBottom: space.base },
    title: { ...typography.label, color: colors.textSecondary, marginBottom: space.md },
    row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
    chip: {
      borderWidth: 1.5, borderColor: colors.border,
      borderRadius: radius.full, paddingHorizontal: space.md,
      paddingVertical: space.sm,
    },
    chipSelected: { borderColor: colors.primary, backgroundColor: colors.primaryMuted },
    chipLabel: { ...typography.label, color: colors.text },
    chipLabelSelected: { color: colors.primary },
    customInput: {
      flex: 1, borderWidth: 1.5, borderColor: colors.border,
      borderRadius: radius.md, paddingHorizontal: space.md,
      paddingVertical: space.sm, ...typography.body1, color: colors.text,
      minWidth: 100,
    },
    confirmBtn: { marginTop: space.md },
    note: { ...typography.caption, color: colors.textSecondary, marginTop: space.sm, textAlign: 'center' },
  });

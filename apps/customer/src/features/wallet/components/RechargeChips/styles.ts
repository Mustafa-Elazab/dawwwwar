import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { paddingHorizontal: layout.screenPaddingH, marginBottom: space.base },
    title: {
      ...typography.label,
      color: colors.textSecondary,
      marginBottom: space.md,
      alignSelf: 'flex-start',
      letterSpacing: 0.3,
    },
    row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
    chip: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.full,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
    },
    chipLabel: { ...typography.label, color: colors.text },
    chipLabelSelected: { color: colors.primary, fontWeight: '700' },
    customInput: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.xl,
      paddingHorizontal: space.md,
      paddingVertical: space.sm,
      ...typography.body1,
      color: colors.text,
      minWidth: 100,
      backgroundColor: colors.surface,
    },
    confirmBtn: { marginTop: space.md },
    note: {
      ...typography.caption,
      color: colors.textDisabled,
      marginTop: space.sm,
      textAlign: 'center',
    },
  });

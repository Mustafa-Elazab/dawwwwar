import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    section: {
      backgroundColor: colors.card,
      marginBottom: space.sm,
      padding: space.base,
      gap: space.md,
    },
    sectionTitle: { ...typography.h4, color: colors.text },
    sectionSubtitle: { ...typography.caption, color: colors.textSecondary },
    mapPickerBtn: {
      flexDirection: 'row', alignItems: 'center', gap: space.sm,
      paddingVertical: space.sm,
    },
    mapPickerText: { ...typography.label, color: colors.primary },
    textArea: {
      minHeight: 100,
      borderWidth: 1.5,
      borderRadius: radius.md,
      borderColor: colors.border,
      padding: space.md,
      ...typography.body1,
      color: colors.text,
      textAlignVertical: 'top',
      backgroundColor: colors.surface,
    },
    itemsDivider: {
      flexDirection: 'row', alignItems: 'center', gap: space.sm,
      marginVertical: space.sm,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
    dividerText: { ...typography.caption, color: colors.textDisabled },
    budgetRow: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1.5, borderRadius: radius.md,
      borderColor: colors.border, overflow: 'hidden',
    },
    budgetInput: {
      flex: 1, ...typography.body1, color: colors.text,
      padding: space.md,
    },
    budgetSuffix: {
      paddingHorizontal: space.md,
      ...typography.label, color: colors.textSecondary,
    },
    errorText: { ...typography.caption, color: colors.error },
    paymentRow: {
      flexDirection: 'row', alignItems: 'center', gap: space.md,
      paddingVertical: space.sm,
    },
    radio: {
      width: 22, height: 22, borderRadius: 11,
      borderWidth: 2, borderColor: colors.border,
      alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
    submitBtn: { margin: space.base },
  });

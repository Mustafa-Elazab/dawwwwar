import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row', alignItems: 'center',
      padding: space.base, borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { ...typography.h4, color: colors.text, flex: 1, textAlign: 'center' },
    map: { flex: 1 },
    hint: {
      position: 'absolute', bottom: 100, alignSelf: 'center',
      backgroundColor: colors.card, paddingHorizontal: space.md,
      paddingVertical: space.sm, borderRadius: radius.full,
      ...shadows.md,
    },
    hintText: { ...typography.caption, color: colors.textSecondary },
    confirmBtn: {
      margin: space.base,
    },
    addressPreview: {
      paddingHorizontal: space.base,
      paddingBottom: space.sm,
    },
    addressText: { ...typography.body2, color: colors.textSecondary },
  });

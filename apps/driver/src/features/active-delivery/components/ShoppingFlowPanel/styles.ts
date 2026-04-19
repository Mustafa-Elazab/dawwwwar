import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: { padding: space.base, gap: space.lg },
    stepTitle: { ...typography.h4, color: colors.text },
    stepSubtitle: { ...typography.body2, color: colors.textSecondary },
    photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
    photoThumb: {
      width: 72, height: 72,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderWidth: 1, borderColor: colors.border,
      borderStyle: 'dashed',
      alignItems: 'center', justifyContent: 'center',
    },
    photoThumbFilled: { borderStyle: 'solid', borderColor: colors.primary },
    amountRow: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1.5, borderRadius: radius.md,
      borderColor: colors.border, overflow: 'hidden',
    },
    amountInput: {
      flex: 1, ...typography.body1, color: colors.text,
      padding: space.md,
    },
    amountSuffix: { ...typography.label, color: colors.textSecondary, paddingHorizontal: space.md },
    warningBox: {
      flexDirection: 'row', gap: space.sm,
      backgroundColor: colors.warningBg,
      borderRadius: radius.md, padding: space.md,
    },
    warningText: { ...typography.caption, color: colors.warning, flex: 1, lineHeight: 18 },
  });

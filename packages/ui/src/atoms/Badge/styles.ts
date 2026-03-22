import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, radius, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    base: {
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sm: { paddingHorizontal: space[2], paddingVertical: 2 },
    md: { paddingHorizontal: space[2], paddingVertical: space[1] },
    dot: { width: 8, height: 8, padding: 0 },

    success: { backgroundColor: colors.successBg },
    error: { backgroundColor: colors.errorBg },
    warning: { backgroundColor: colors.warningBg },
    info: { backgroundColor: colors.infoBg },
    neutral: { backgroundColor: colors.surfaceVariant },
    primary: { backgroundColor: colors.primaryMuted },

    labelSuccess: { ...typography.caption, color: colors.success, fontWeight: '600' },
    labelError: { ...typography.caption, color: colors.error, fontWeight: '600' },
    labelWarning: { ...typography.caption, color: colors.warning, fontWeight: '600' },
    labelInfo: { ...typography.caption, color: colors.info, fontWeight: '600' },
    labelNeutral: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
    labelPrimary: { ...typography.caption, color: colors.primary, fontWeight: '600' },

    dotSuccess: { backgroundColor: colors.success },
    dotError: { backgroundColor: colors.error },
    dotWarning: { backgroundColor: colors.warning },
    dotInfo: { backgroundColor: colors.info },
    dotNeutral: { backgroundColor: colors.textSecondary },
    dotPrimary: { backgroundColor: colors.primary },
  });

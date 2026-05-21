import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows, layout } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    timelineContainer: {
      backgroundColor: colors.card,
      paddingHorizontal: layout.screenPaddingH,
      paddingVertical: space.lg,
      marginBottom: space.sm,
    },
    statusLabel: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'center',
      marginTop: space.base,
      fontWeight: '700',
    },
    driverCard: {
      backgroundColor: colors.card,
      marginHorizontal: layout.screenPaddingH,
      borderRadius: radius.xl,
      padding: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      marginBottom: space.sm,
      borderWidth: 1,
      borderColor: colors.borderLight,
      ...shadows.xs,
    },
    driverInfo: { flex: 1, gap: 2 },
    driverName: { ...typography.label, color: colors.text, fontWeight: '600' },
    driverMeta: { ...typography.caption, color: colors.textSecondary },
    callBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtn: {
      marginHorizontal: layout.screenPaddingH,
      marginVertical: space.md,
    },
    mapPlaceholder: {
      height: 180,
      marginBottom: space.sm,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapPlaceholderText: {
      ...typography.caption,
      color: colors.textSecondary,
    },
  });

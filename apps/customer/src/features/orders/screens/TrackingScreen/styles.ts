import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { space, typography, radius, shadows } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    timelineContainer: {
      backgroundColor: colors.card,
      paddingHorizontal: space.base,
      paddingVertical: space.lg,
      marginBottom: space.sm,
    },
    statusLabel: {
      ...typography.h4,
      color: colors.text,
      textAlign: 'center',
      marginTop: space.base,
    },
    driverCard: {
      backgroundColor: colors.card,
      marginHorizontal: space.base,
      borderRadius: radius.xl,
      padding: space.base,
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.md,
      marginBottom: space.sm,
      ...shadows.md,
    },
    driverInfo: { flex: 1 },
    driverName: { ...typography.label, color: colors.text },
    driverMeta: { ...typography.caption, color: colors.textSecondary },
    callBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtn: {
      margin: space.base,
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

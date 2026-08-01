import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

export const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
    },
    scrollContent: {
      gap: spacing[5],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[5],
    },
    hero: {
      gap: spacing[2],
    },
    section: {
      gap: spacing[4],
    },
    eventSummary: {
      minHeight: 72,
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      padding: spacing[4],
      justifyContent: 'center',
    },
    eventText: {
      gap: spacing[1],
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    metricCard: {
      width: '47%',
      minHeight: 88,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      padding: spacing[3],
      justifyContent: 'space-between',
      gap: spacing[2],
    },
    varianceBanner: {
      minHeight: 44,
      borderRadius: radius.md,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
    },
    formFields: {
      gap: spacing[4],
    },
    fieldLabel: {
      marginBottom: spacing[2],
    },
    categoryPicker: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    categoryChip: {
      minHeight: 44,
      minWidth: '30%',
      maxWidth: '48%',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
    },
    inputGrid: {
      flexDirection: 'row',
      gap: spacing[3],
    },
    actionRow: {
      gap: spacing[3],
    },
    listStack: {
      gap: spacing[3],
    },
    summaryRow: {
      minHeight: 64,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      padding: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    summaryText: {
      flex: 1,
      gap: spacing[1],
    },
    summaryAmounts: {
      minWidth: 112,
      alignItems: 'flex-end',
      gap: spacing[1],
    },
    itemRow: {
      minHeight: 68,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      padding: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    itemText: {
      flex: 1,
      gap: spacing[1],
    },
    itemAmounts: {
      minWidth: 112,
      alignItems: 'flex-end',
      gap: spacing[1],
    },
    emptyState: {
      minHeight: 72,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      padding: spacing[4],
    },
  });

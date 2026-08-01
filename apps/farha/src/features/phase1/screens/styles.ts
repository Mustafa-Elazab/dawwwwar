import { StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

export const createPhase1Styles = (colors: AppColors) =>
  StyleSheet.create({
    screenContent: {
      flex: 1,
    },
    scrollContent: {
      gap: spacing[4],
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[5],
      paddingBottom: spacing[8],
    },
    centered: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    header: {
      gap: spacing[2],
      marginBottom: spacing[2],
    },
    headerActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    section: {
      gap: spacing[4],
    },
    stack: {
      gap: spacing[3],
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    wrapRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[2],
    },
    formGrid: {
      flexDirection: 'row',
      gap: spacing[3],
    },
    gridItem: {
      flex: 1,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    metric: {
      width: '47%',
      minHeight: 84,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: colors.border,
      padding: spacing[3],
      gap: spacing[2],
      justifyContent: 'space-between',
    },
    cardTint: {
      borderRadius: radius.md,
      backgroundColor: colors.primaryLight,
      padding: spacing[4],
      gap: spacing[2],
    },
    listRow: {
      minHeight: 64,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: radius.md,
      borderColor: colors.border,
      padding: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    rowText: {
      flex: 1,
      gap: spacing[1],
    },
    rowSide: {
      minWidth: 96,
      alignItems: 'flex-end',
      gap: spacing[1],
    },
    emptyBox: {
      minHeight: 76,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      padding: spacing[4],
    },
    warningBox: {
      borderRadius: radius.md,
      backgroundColor: colors.warningBg,
      padding: spacing[3],
    },
    successBox: {
      borderRadius: radius.md,
      backgroundColor: colors.successBg,
      padding: spacing[3],
    },
    dangerBox: {
      borderRadius: radius.md,
      backgroundColor: colors.errorBg,
      padding: spacing[3],
    },
    shareCard: {
      minHeight: 240,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryLight,
      padding: spacing[5],
      justifyContent: 'space-between',
      gap: spacing[4],
    },
    bottomTabs: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[2],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      gap: spacing[1],
    },
    tabItem: {
      flex: 1,
      minHeight: 48,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[1],
    },
    adBanner: {
      minHeight: 52,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceVariant,
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
  });

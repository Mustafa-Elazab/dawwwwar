import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, spacing } from '@dawwar/theme';

export const createPhase1ScreenStyles = (colors: AppColors) =>
  StyleSheet.create({
    screenContent: {
      flex: 1,
      borderTopLeftRadius: 56,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    scrollContent: {
      gap: spacing[4],
      paddingHorizontal: spacing[4],
      paddingTop: spacing[8],
      paddingBottom: spacing[10],
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
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      padding: spacing[5],
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
    choiceChip: {
      minHeight: 42,
      minWidth: 104,
      borderRadius: radius.full,
      borderWidth: 1,
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
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
      borderRadius: radius.lg,
      borderColor: colors.border,
      backgroundColor: colors.card,
      padding: spacing[4],
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
    coverPhotoEmpty: {
      minHeight: 118,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.card,
      padding: spacing[4],
      justifyContent: 'center',
    },
    coverPhotoPreview: {
      minHeight: 144,
      borderRadius: radius.lg,
      overflow: 'hidden',
      justifyContent: 'flex-end',
      backgroundColor: colors.primaryLight,
    },
    coverPhotoImage: {
      borderRadius: radius.lg,
    },
    coverPhotoOverlay: {
      minHeight: 54,
      backgroundColor: 'rgba(0, 0, 0, 0.34)',
      justifyContent: 'center',
      paddingHorizontal: spacing[4],
    },
    bottomTabs: {
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: spacing[2],
      paddingTop: spacing[2],
    },
    tabsRow: {
      minHeight: 58,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing[1],
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabItem: {
      minWidth: 54,
      minHeight: 54,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing[1],
    },
    tabIconBubble: {
      width: 42,
      height: 30,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabLabel: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '800',
      writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    },
  });

export type Phase1ScreenStyles = ReturnType<typeof createPhase1ScreenStyles>;

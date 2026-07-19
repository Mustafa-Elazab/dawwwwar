import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    content: {
      padding: space.base,
      paddingBottom: 120,
      gap: space.md,
    },
    summaryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    statusPill: {
      borderRadius: radius.full,
      paddingHorizontal: space.sm,
      paddingVertical: 5,
    },
    statusText: {
      ...typography.caption,
      fontWeight: '800',
    },
    section: {
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: space.md,
      gap: space.sm,
      ...shadows.sm,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    itemThumb: {
      width: 52,
      height: 52,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    itemImage: {
      width: '100%',
      height: '100%',
    },
    itemText: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    itemName: {
      ...typography.label,
      color: colors.text,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    itemMeta: {
      ...typography.caption,
      color: colors.textSecondary,
      marginTop: 3,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    itemPrice: {
      ...typography.label,
      color: colors.primary,
      fontWeight: '900',
      textAlign: 'auto',
    },
    infoBlock: {
      flexDirection: 'row',
      gap: space.sm,
      alignItems: 'center',
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      padding: space.md,
    },
    infoTextBlock: {
      flex: 1,
    },
    infoTitle: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '800',
      marginBottom: 3,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    infoValue: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    moneyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    moneyLabel: {
      ...typography.body2,
      color: colors.textSecondary,
      textAlign: 'auto',
    },
    moneyValue: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '800',
      textAlign: 'auto',
    },
    moneyLabelStrong: {
      ...typography.body1,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'auto',
    },
    moneyValueStrong: {
      ...typography.h4,
      color: colors.text,
      fontWeight: '900',
      textAlign: 'auto',
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginVertical: space.xs,
    },
    reasonBox: {
      borderRadius: radius.lg,
      padding: space.md,
      backgroundColor: colors.errorBg,
    },
    reasonTitle: {
      ...typography.caption,
      color: colors.error,
      fontWeight: '900',
      marginBottom: 4,
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    reasonText: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '700',
      textAlign: 'auto',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    footer: {
      flexDirection: 'row',
      gap: space.sm,
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    footerButton: {
      flex: 1,
      minWidth: 112,
      borderRadius: radius.full,
    },
  });

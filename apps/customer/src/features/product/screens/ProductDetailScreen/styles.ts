import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    content: {
      paddingBottom: 130,
      gap: space.lg,
    },
    image: {
      width: '100%',
      height: 300,
      backgroundColor: colors.surfaceVariant,
    },
    body: {
      paddingHorizontal: space.base,
      gap: space.lg,
    },
    titleBlock: {
      gap: space.sm,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    name: {
      ...typography.h2,
      color: colors.text,
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    description: {
      ...typography.body2,
      color: colors.textSecondary,
      lineHeight: 22,
      textAlign: isRTL ? 'right' : 'left',
      writingDirection: isRTL ? 'rtl' : 'ltr',
    },
    merchantCard: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.sm,
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      backgroundColor: colors.surface,
    },
    merchantIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    merchantText: {
      flex: 1,
      alignItems: isRTL ? 'flex-end' : 'flex-start',
    },
    merchantLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '700',
      textAlign: isRTL ? 'right' : 'left',
    },
    merchantName: {
      ...typography.label,
      color: colors.text,
      fontWeight: '900',
      textAlign: isRTL ? 'right' : 'left',
    },
    buyCard: {
      padding: space.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.borderLight,
      backgroundColor: colors.surface,
      gap: space.md,
      ...shadows.sm,
    },
    priceRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    priceLabel: {
      ...typography.caption,
      color: colors.textSecondary,
      fontWeight: '800',
    },
    price: {
      ...typography.h3,
      color: colors.primary,
      fontWeight: '900',
    },
    quantityRow: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    quantityLabel: {
      ...typography.body2,
      color: colors.text,
      fontWeight: '800',
    },
    stepper: {
      flexDirection: isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: space.sm,
    },
    stepperBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
    stepperBtnSecondary: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quantityValue: {
      ...typography.h4,
      minWidth: 32,
      textAlign: 'center',
      color: colors.text,
      fontWeight: '900',
    },
    unavailable: {
      padding: space.md,
      borderRadius: radius.md,
      backgroundColor: colors.errorBg,
    },
    unavailableText: {
      ...typography.body2,
      color: colors.error,
      fontWeight: '800',
      textAlign: 'center',
    },
    footer: {
      paddingHorizontal: space.base,
      paddingTop: space.sm,
      paddingBottom: space.lg,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
  });

import { I18nManager, StyleSheet } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { radius, shadows, space, typography } from '@dawwar/theme';

export const createStyles = (colors: AppColors, isRTL = I18nManager.isRTL) =>
  Object.assign(
    StyleSheet.create({
      content: {
        paddingBottom: 130,
      },
      image: {
        width: '100%',
        height: 300,
        backgroundColor: colors.surfaceVariant,
      },
      body: {
        paddingHorizontal: space.base,
        paddingTop: space.lg,
        gap: space.lg,
      },
      titleBlock: {
        gap: space.sm,
        alignItems: isRTL ? 'flex-end' : 'flex-start',
      },
      name: {
        ...typography.h2,
        color: colors.text,
        textAlign: 'auto',
        writingDirection: isRTL ? 'rtl' : 'ltr',
      },
      description: {
        ...typography.body2,
        color: colors.textSecondary,
        lineHeight: 22,
        textAlign: 'auto',
        writingDirection: isRTL ? 'rtl' : 'ltr',
      },
      merchantCard: {
        flexDirection: 'row',
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
        textAlign: 'auto',
      },
      merchantName: {
        ...typography.label,
        color: colors.text,
        fontWeight: '900',
        textAlign: 'auto',
      },
      optionSection: {
        padding: space.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borderLight,
        backgroundColor: colors.surface,
        gap: space.sm,
      },
      optionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.sm,
      },
      optionTitleBlock: {
        flex: 1,
        alignItems: isRTL ? 'flex-end' : 'flex-start',
      },
      optionTitle: {
        ...typography.body1,
        color: colors.text,
        fontWeight: '900',
        textAlign: 'auto',
        writingDirection: isRTL ? 'rtl' : 'ltr',
      },
      optionHelper: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'auto',
      },
      requiredPill: {
        borderRadius: radius.full,
        backgroundColor: colors.primaryLight,
        paddingHorizontal: space.sm,
        paddingVertical: 4,
      },
      optionalPill: {
        borderRadius: radius.full,
        backgroundColor: colors.surfaceVariant,
        paddingHorizontal: space.sm,
        paddingVertical: 4,
      },
      requiredPillText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '900',
      },
      optionalPillText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '800',
      },
      optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.borderLight,
        padding: space.md,
      },
      optionRowSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
      },
      optionRowDisabled: {
        opacity: 0.45,
      },
      optionTextBlock: {
        flex: 1,
        alignItems: isRTL ? 'flex-end' : 'flex-start',
      },
      optionName: {
        ...typography.body2,
        color: colors.text,
        fontWeight: '800',
        textAlign: 'auto',
      },
      optionPrice: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '900',
        marginTop: 2,
      },
      optionControl: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
      },
      optionControlSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
      },
      variantList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: space.sm,
      },
      variantChip: {
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.borderLight,
        paddingHorizontal: space.md,
        paddingVertical: space.sm,
        backgroundColor: colors.surface,
      },
      variantChipSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
      },
      variantText: {
        ...typography.caption,
        color: colors.text,
        fontWeight: '900',
      },
      variantTextSelected: {
        color: colors.primaryText,
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
        flexDirection: 'row',
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      quantityLabel: {
        ...typography.body2,
        color: colors.text,
        fontWeight: '800',
      },
      stepper: {
        flexDirection: 'row',
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
      validationBox: {
        padding: space.md,
        borderRadius: radius.md,
        backgroundColor: colors.errorBg,
      },
      validationText: {
        ...typography.body2,
        color: colors.error,
        fontWeight: '800',
        textAlign: 'auto',
        writingDirection: isRTL ? 'rtl' : 'ltr',
      },
      footer: {
        paddingHorizontal: space.base,
        paddingTop: space.sm,
        paddingBottom: space.lg,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
      },
    }),
    {
      tokens: {
        primary: colors.primary,
        primaryText: colors.primaryText,
        text: colors.text,
        textSecondary: colors.textSecondary,
      },
    },
  );

export type ProductDetailStyles = ReturnType<typeof createStyles>;

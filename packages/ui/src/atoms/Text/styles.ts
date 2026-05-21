import { StyleSheet, I18nManager } from 'react-native';
import type { AppColors, TypographyVariant } from '@dawwar/theme';
import { getTypographyStyle } from '@dawwar/theme';

const buildVariantStyles = (rtl: boolean) => {
  const variants: TypographyVariant[] = [
    'display',
    'heading',
    'title',
    'h1',
    'h2',
    'h3',
    'h4',
    'body',
    'bodySm',
    'body1',
    'body2',
    'caption',
    'label',
    'button',
    'buttonSm',
    'overline',
  ];

  return variants.reduce<Record<TypographyVariant, ReturnType<typeof getTypographyStyle>>>(
    (acc, variant) => {
      acc[variant] = getTypographyStyle(variant, rtl);
      return acc;
    },
    {} as Record<TypographyVariant, ReturnType<typeof getTypographyStyle>>,
  );
};

export const createStyles = (colors: AppColors) => {
  const rtl = I18nManager.isRTL;
  const variantStyles = buildVariantStyles(rtl);

  return StyleSheet.create({
    base: {
      color: colors.text,
      // RTL: writingDirection mirrors text for Arabic characters
      writingDirection: rtl ? 'rtl' : 'ltr',
    },
    // Pre-built variant overrides (color applied separately via prop)
    ...variantStyles,
  });
};

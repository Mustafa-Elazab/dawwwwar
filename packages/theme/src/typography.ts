import type { TextStyle } from 'react-native';
import { getArabicLineHeight, getFontFamily } from './fonts';

export const Typography = {
  fontFamily: {
    arabic: 'Cairo',
    english: 'Nunito',
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 38,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
} as const;

const fontSize = {
  xs: Typography.size.xs,
  sm: Typography.size.sm,
  base: Typography.size.base,
  md: Typography.size.md,
  lg: Typography.size.lg,
  xl: Typography.size.xl,
  '2xl': Typography.size['2xl'],
  '3xl': Typography.size['3xl'],
  '4xl': 44,
} as const;

const lineHeight = {
  xs: 16,
  sm: 18,
  base: 22,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 38,
  '3xl': 46,
  '4xl': 52,
} as const;

export const typography = {
  display: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: Typography.weight.black,
    letterSpacing: -0.4,
  },
  heading: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.25,
  },
  title: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: Typography.weight.bold,
  },
  h1: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: Typography.weight.black,
    letterSpacing: -0.2,
  },
  h2: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: Typography.weight.bold,
    letterSpacing: -0.1,
  },
  h3: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: Typography.weight.bold,
  },
  h4: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: Typography.weight.semibold,
  },
  body: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: Typography.weight.regular,
  },
  bodySm: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: Typography.weight.regular,
  },
  body1: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: Typography.weight.regular,
  },
  body2: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: Typography.weight.regular,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: Typography.weight.regular,
  },
  label: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: Typography.weight.medium,
  },
  button: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: Typography.weight.semibold,
    letterSpacing: 0.2,
  },
  buttonSm: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: Typography.weight.semibold,
  },
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: Typography.weight.medium,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

const variantGroups: Record<
  TypographyVariant,
  'display' | 'heading' | 'title' | 'body' | 'label' | 'caption'
> = {
  display: 'display',
  heading: 'heading',
  title: 'title',
  h1: 'heading',
  h2: 'heading',
  h3: 'title',
  h4: 'title',
  body: 'body',
  bodySm: 'body',
  body1: 'body',
  body2: 'body',
  caption: 'caption',
  label: 'label',
  button: 'label',
  buttonSm: 'label',
  overline: 'label',
};

export const getTypographyStyle = (variant: TypographyVariant, rtl: boolean) => {
  const base = typography[variant] as TextStyle;
  const fontFamily = getFontFamily(base.fontWeight, rtl);
  const group = variantGroups[variant];
  const lineHeight = rtl ? getArabicLineHeight(base.lineHeight, group) : base.lineHeight;
  const letterSpacing = rtl ? 0 : base.letterSpacing;

  return {
    ...base,
    fontFamily,
    lineHeight,
    letterSpacing,
  } as TextStyle;
};

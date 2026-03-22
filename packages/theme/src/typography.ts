import { StyleSheet } from 'react-native';

// Base font sizes
const fontSize = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
} as const;

// Line heights (always 1.4–1.5× the font size for readability)
const lineHeight = {
  xs: 16,
  sm: 18,
  base: 20,
  md: 24,
  lg: 26,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
} as const;

// Text variant styles
// These are plain objects, not StyleSheet — they get merged into component styles
export const typography = {
  h1: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    fontWeight: '600' as const,
  },
  body1: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: '400' as const,
  },
  body2: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: '500' as const,
  },
  button: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  buttonSm: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: '600' as const,
  },
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: '500' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

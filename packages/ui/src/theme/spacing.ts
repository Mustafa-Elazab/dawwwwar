import { space } from '@dawwar/theme';

export const figmaSpacing = {
  hairline: 1,
  xxs: space.xxs,
  xs: space.xs,
  sm: space.sm,
  md: space.md,
  base: space.base,
  lg: space.lg,
  xl: space.xl,
  xxl: space['2xl'],
  screen: space.xl,
  section: space.xl,
  control: space.base,
  tabInset: space.sm,
} as const;

export type FigmaSpacingKey = keyof typeof figmaSpacing;

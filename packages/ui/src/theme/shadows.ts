import { shadows } from '@dawwar/theme';

export const figmaShadows = {
  none: shadows.none,
  surface: shadows.xs,
  card: shadows.sm,
  floating: shadows.lg,
  sheet: shadows.xl,
} as const;

export type FigmaShadowKey = keyof typeof figmaShadows;

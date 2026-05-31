import { radius } from '@dawwar/theme';

export const figmaRadius = {
  none: radius.none,
  control: radius.md,
  card: radius.md,
  sheet: radius.xl,
  floating: radius['2xl'],
  pill: radius.full,
  circle: radius.full,
} as const;

export type FigmaRadiusKey = keyof typeof figmaRadius;

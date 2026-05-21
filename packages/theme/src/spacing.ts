export const Spacing = {
  screenH: 20,
  cardPad: 16,
  gap: 12,
  gapLg: 20,
} as const;

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  full: 9999,
  card: 20,
  button: 16,
  input: 14,
  chip: 24,
} as const;

export const spacing = {
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: Spacing.gap,
  4: Spacing.cardPad,
  5: Spacing.gapLg,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
} as const;

export const space = {
  xxs: spacing[0.5],
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[3],
  base: spacing[4],
  lg: spacing[5],
  xl: spacing[6],
  '2xl': spacing[8],
  '3xl': spacing[10],
  '4xl': spacing[12],
  '5xl': spacing[16],
  '6xl': spacing[20],
  screenH: Spacing.screenH,
  cardPad: Spacing.cardPad,
  gap: Spacing.gap,
  gapLg: Spacing.gapLg,
} as const;

export const layout = {
  screenPaddingH: Spacing.screenH,
  screenPaddingV: spacing[3],
  sectionGap: spacing[6],
  cardGap: Spacing.gap,
  inlineGap: spacing[2],
  hitSlop: { top: 12, bottom: 12, left: 12, right: 12 } as const,
  minTouchTarget: 44,
} as const;

export const radius = {
  none: 0,
  xs: Radius.xs,
  sm: Radius.sm,
  md: Radius.md,
  lg: Radius.lg,
  xl: Radius.xl,
  '2xl': Radius.card,
  '3xl': Radius.chip,
  '4xl': Radius.xl,
  full: Radius.full,
  card: Radius.card,
  button: Radius.button,
  input: Radius.input,
  chip: Radius.chip,
} as const;

export type SpacingKey = keyof typeof space;

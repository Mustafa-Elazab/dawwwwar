// Base unit: 4px
// All spacing is a multiple of 4

export const spacing = {
  1: 4,    // xs — tight icon padding
  2: 8,    // sm — small gaps between related elements
  3: 12,   // md — standard inner padding
  4: 16,   // base — default content padding (most used)
  5: 20,   // lg — slightly more breathing room
  6: 24,   // xl — section spacing
  8: 32,   // 2xl — large section gaps
  10: 40,  // 3xl
  12: 48,  // 4xl
  16: 64,  // screen-level padding
} as const;

// Named aliases for readability
export const space = {
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[3],
  base: spacing[4],
  lg: spacing[5],
  xl: spacing[6],
  '2xl': spacing[8],
  '3xl': spacing[10],
  '4xl': spacing[12],
} as const;

// Common border radius values
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,  // pill / circle
} as const;

export type SpacingKey = keyof typeof space;

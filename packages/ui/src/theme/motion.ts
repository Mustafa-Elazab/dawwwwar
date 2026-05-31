export const figmaMotion = {
  fast: 120,
  normal: 180,
  slow: 240,
} as const;

export type FigmaMotionKey = keyof typeof figmaMotion;

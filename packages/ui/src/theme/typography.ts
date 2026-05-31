import { typography } from '@dawwar/theme';

export const figmaTypography = {
  display: typography.h1,
  title: typography.h3,
  header: typography.h4,
  body: typography.body1,
  bodyStrong: typography.label,
  label: typography.buttonSm,
  caption: typography.caption,
  tiny: typography.overline,
} as const;

export type FigmaTypographyKey = keyof typeof figmaTypography;

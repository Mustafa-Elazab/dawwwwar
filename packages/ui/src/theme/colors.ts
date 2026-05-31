import type { AppColors } from '@dawwar/theme';

export type FigmaColorTokens = {
  background: string;
  surface: string;
  surfaceRaised: string;
  field: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  brand: string;
  brandPressed: string;
  brandSoft: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  icon: string;
  iconActive: string;
  overlay: string;
  tabBar: string;
};

export function createFigmaColors(colors: AppColors): FigmaColorTokens {
  return {
    background: colors.background,
    surface: colors.surface,
    surfaceRaised: colors.card,
    field: colors.surfaceVariant,
    border: colors.borderLight,
    borderStrong: colors.border,
    text: colors.text,
    textMuted: colors.textSecondary,
    textSubtle: colors.textTertiary,
    textInverse: colors.textInverse,
    brand: colors.primary,
    brandPressed: colors.primaryDark,
    brandSoft: colors.primaryLight,
    success: colors.success,
    successSoft: colors.successBg,
    warning: colors.warning,
    warningSoft: colors.warningBg,
    error: colors.error,
    errorSoft: colors.errorBg,
    icon: colors.icon,
    iconActive: colors.iconActive,
    overlay: colors.overlay,
    tabBar: colors.tabBar,
  };
}

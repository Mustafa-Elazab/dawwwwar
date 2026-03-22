// Brand palette — raw values, not used directly by components
export const palette = {
  brand: '#FF6B35',
  brandDark: '#E55A2B',
  brandLight: '#FF8C5A',
  brandMuted: '#FFF0EB',

  green: '#00B894',
  greenLight: '#D4EFEA',
  red: '#E17055',
  redLight: '#FDECEA',
  orange: '#FDCB6E',
  orangeLight: '#FEF9EC',
  blue: '#74B9FF',
  blueLight: '#EBF5FF',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Light theme — every key is a semantic name, not a raw color
export const lightColors = {
  // Backgrounds
  background: palette.white,
  surface: palette.gray50,
  surfaceVariant: palette.gray100,
  card: palette.white,

  // Borders
  border: palette.gray200,
  borderLight: palette.gray100,
  borderFocus: palette.brand,

  // Text
  text: palette.gray900,
  textSecondary: palette.gray500,
  textDisabled: palette.gray300,
  textInverse: palette.white,
  textLink: palette.brand,

  // Brand
  primary: palette.brand,
  primaryDark: palette.brandDark,
  primaryLight: palette.brandLight,
  primaryMuted: palette.brandMuted,
  primaryText: palette.white,          // text on primary background

  // Status
  success: palette.green,
  successBg: palette.greenLight,
  error: palette.red,
  errorBg: palette.redLight,
  warning: palette.orange,
  warningBg: palette.orangeLight,
  info: palette.blue,
  infoBg: palette.blueLight,

  // UI elements
  icon: palette.gray500,
  iconActive: palette.brand,
  iconInverse: palette.white,
  placeholder: palette.gray400,
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.08)',
  shimmer: palette.gray200,            // skeleton loading color
  shimmerHighlight: palette.gray50,    // skeleton shimmer highlight

  // Navigation
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  tabBarIcon: palette.gray400,
  tabBarIconActive: palette.brand,

  // Status bar
  statusBarStyle: 'dark-content' as const,
  statusBarBg: palette.white,
} as const;

// Dark theme — EVERY key from lightColors must be present here
export const darkColors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceVariant: '#252525',
  card: '#1C1C1E',

  // Borders
  border: '#3A3A3C',
  borderLight: '#2C2C2E',
  borderFocus: palette.brand,

  // Text
  text: palette.gray50,
  textSecondary: palette.gray400,
  textDisabled: palette.gray600,
  textInverse: palette.gray900,
  textLink: palette.brandLight,

  // Brand (same in both themes)
  primary: palette.brand,
  primaryDark: palette.brandDark,
  primaryLight: palette.brandLight,
  primaryMuted: '#3D1F13',
  primaryText: palette.white,

  // Status
  success: '#00D2A8',
  successBg: '#0A2E28',
  error: '#FF8A7A',
  errorBg: '#2E1410',
  warning: '#FFD93D',
  warningBg: '#2E2A0A',
  info: '#93CFFF',
  infoBg: '#0A1A2E',

  // UI elements
  icon: palette.gray400,
  iconActive: palette.brand,
  iconInverse: palette.gray900,
  placeholder: palette.gray600,
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.4)',
  shimmer: '#2A2A2A',
  shimmerHighlight: '#3A3A3A',

  // Navigation
  tabBar: '#1A1A1A',
  tabBarBorder: '#3A3A3C',
  tabBarIcon: palette.gray600,
  tabBarIconActive: palette.brand,

  // Status bar
  statusBarStyle: 'light-content' as const,
  statusBarBg: '#0D0D0D',
} as const;

// AppColors type — derived from lightColors (both themes must satisfy this type)
export type AppColors = {
  [K in keyof typeof lightColors]: string;
} & { statusBarStyle: 'dark-content' | 'light-content' };

// Type guard: ensures darkColors has all keys from lightColors
// TypeScript will error here if a key is missing from darkColors
const _typeCheck: AppColors = darkColors;
void _typeCheck; // suppress unused variable warning

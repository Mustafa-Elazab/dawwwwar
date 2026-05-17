// Brand palette — raw values, not used directly by components
export const palette = {
  brand: '#1DB954',         // Green
  brandDark: '#17A348',     // Darker green
  brandLight: '#E8F8EF',    // Lightest green tint
  brandMuted: '#A8E6C3',    // Muted green

  green: '#1DB954',
  greenLight: '#E8F8EF',
  red: '#EF4444',
  redLight: '#FEE2E2',
  orange: '#F59E0B',
  orangeLight: '#FEF3C7',
  blue: '#3B82F6',
  blueLight: '#DBEAFE',

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
  background: palette.gray50,
  surface: palette.white,
  surfaceVariant: palette.gray100,
  card: palette.white,

  // Borders
  border: palette.gray200,
  borderLight: palette.gray100,
  borderFocus: palette.brand,

  // Text
  text: palette.gray900,
  textSecondary: palette.gray500,
  textTertiary: palette.gray400,
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
  statusBarBg: palette.gray50,
} as const;

// Dark theme — EVERY key from lightColors must be present here
export const darkColors = {
  // Backgrounds
  background: '#0A0A0A',
  surface: '#1A1A1A',
  surfaceVariant: '#252525',
  card: '#1A1A1A',

  // Borders
  border: '#2A2A2A',
  borderLight: '#2C2C2E',
  borderFocus: palette.brand,

  // Text
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textDisabled: '#6B7280',
  textInverse: '#111827',
  textLink: palette.brand,

  // Brand (same in both themes)
  primary: palette.brand,
  primaryDark: palette.brandDark,
  primaryLight: palette.brandLight,
  primaryMuted: '#0F5132',
  primaryText: palette.white,

  // Status
  success: '#1DB954',
  successBg: '#0F5132',
  error: '#EF4444',
  errorBg: '#2E1410',
  warning: '#F59E0B',
  warningBg: '#2E2A0A',
  info: '#3B82F6',
  infoBg: '#0A1A2E',

  // UI elements
  icon: '#9CA3AF',
  iconActive: palette.brand,
  iconInverse: '#111827',
  placeholder: '#6B7280',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.4)',
  shimmer: '#2A2A2A',
  shimmerHighlight: '#3A3A3A',

  // Navigation
  tabBar: '#1A1A1A',
  tabBarBorder: '#2A2A2A',
  tabBarIcon: '#6B7280',
  tabBarIconActive: palette.brand,

  // Status bar
  statusBarStyle: 'light-content' as const,
  statusBarBg: '#0A0A0A',
} as const;

// AppColors type — derived from lightColors (both themes must satisfy this type)
export type AppColors = {
  [K in keyof typeof lightColors]: string;
} & { statusBarStyle: 'dark-content' | 'light-content' };

// Type guard: ensures darkColors has all keys from lightColors
// TypeScript will error here if a key is missing from darkColors
const _typeCheck: AppColors = darkColors;
void _typeCheck; // suppress unused variable warning

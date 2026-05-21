export const Colors = {
  // Brand
  primary: '#1DB954',
  primaryDark: '#17A348',
  primaryLight: '#E8F8EF',
  primaryGlow: 'rgba(29,185,84,0.15)',

  // Backgrounds
  bg: '#0D0D0D',
  bgCard: '#1A1A1A',
  bgElevated: '#242424',
  bgInput: '#1F1F1F',
  bgOverlay: 'rgba(0,0,0,0.6)',

  // Text
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textTertiary: '#606060',
  textInverse: '#0D0D0D',

  // Borders
  border: 'rgba(255,255,255,0.08)',
  borderMid: 'rgba(255,255,255,0.14)',

  // Semantic
  success: '#1DB954',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Order status
  statusPending: '#F59E0B',
  statusAccepted: '#3B82F6',
  statusReady: '#8B5CF6',
  statusAssigned: '#EC4899',
  statusPickedUp: '#F97316',
  statusDelivered: '#1DB954',
  statusCompleted: '#059669',
  statusCancelled: '#6B7280',
  statusRejected: '#EF4444',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// Backward-compatible raw palette used across existing components.
export const palette = {
  brand: Colors.primary,
  brandDark: Colors.primaryDark,
  brandLight: Colors.primaryLight,
  brandMuted: Colors.primaryGlow,
  green: Colors.success,
  greenLight: Colors.primaryLight,
  red: Colors.error,
  redLight: 'rgba(239,68,68,0.16)',
  orange: Colors.warning,
  orangeLight: 'rgba(245,158,11,0.18)',
  blue: Colors.info,
  blueLight: 'rgba(59,130,246,0.18)',
  gray50: Colors.textPrimary,
  gray100: Colors.bgInput,
  gray200: Colors.border,
  gray300: Colors.borderMid,
  gray400: Colors.textTertiary,
  gray500: Colors.textSecondary,
  gray600: '#808080',
  gray700: Colors.bgElevated,
  gray800: Colors.bgCard,
  gray900: Colors.bg,
  white: Colors.white,
  black: Colors.black,
} as const;

const semanticTheme = {
  // Backgrounds
  background: Colors.bg,
  surface: Colors.bgCard,
  surfaceVariant: Colors.bgElevated,
  card: Colors.bgCard,

  // Borders
  border: Colors.border,
  borderLight: Colors.borderMid,
  borderFocus: 'rgba(29,185,84,0.5)',

  // Text
  text: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  textTertiary: Colors.textTertiary,
  textDisabled: Colors.textTertiary,
  textInverse: Colors.textInverse,
  textLink: Colors.primary,

  // Brand
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  primaryLight: Colors.primaryLight,
  primaryGlow: Colors.primaryGlow,
  primaryMuted: Colors.primaryGlow,
  primaryText: Colors.textInverse,

  // Status
  success: Colors.success,
  successBg: 'rgba(29,185,84,0.16)',
  error: Colors.error,
  errorBg: 'rgba(239,68,68,0.16)',
  warning: Colors.warning,
  warningBg: 'rgba(245,158,11,0.16)',
  info: Colors.info,
  infoBg: 'rgba(59,130,246,0.16)',

  // UI elements
  icon: Colors.textSecondary,
  iconActive: Colors.primary,
  iconInverse: Colors.textInverse,
  placeholder: Colors.textTertiary,
  overlay: Colors.bgOverlay,
  shadow: 'rgba(0,0,0,0.35)',
  shimmer: Colors.bgElevated,
  shimmerHighlight: '#2D2D2D',

  // Navigation
  tabBar: Colors.bgCard,
  tabBarBorder: Colors.border,
  tabBarIcon: Colors.textTertiary,
  tabBarIconActive: Colors.primary,

  // Order status
  statusPending: Colors.statusPending,
  statusAccepted: Colors.statusAccepted,
  statusReady: Colors.statusReady,
  statusAssigned: Colors.statusAssigned,
  statusPickedUp: Colors.statusPickedUp,
  statusDelivered: Colors.statusDelivered,
  statusCompleted: Colors.statusCompleted,
  statusCancelled: Colors.statusCancelled,
  statusRejected: Colors.statusRejected,

  // Status bar
  statusBarStyle: 'light-content' as const,
  statusBarBg: Colors.bg,
} as const;

export const lightColors = {
  ...semanticTheme,
} as const;

export const darkColors = {
  ...semanticTheme,
} as const;

// AppColors type — derived from lightColors (both themes must satisfy this type)
export type AppColors = {
  [K in keyof typeof lightColors]: string;
} & { statusBarStyle: 'dark-content' | 'light-content' };

// Type guard: ensures darkColors has all keys from lightColors
// TypeScript will error here if a key is missing from darkColors
const _typeCheck: AppColors = darkColors;
void _typeCheck; // suppress unused variable warning

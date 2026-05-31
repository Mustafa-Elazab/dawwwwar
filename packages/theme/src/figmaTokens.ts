import { Platform } from 'react-native';

export const figmaColors = {
  brand: '#FF634F',
  brandSoft: '#FFD1C8',
  brandTint: '#FFF0ED',
  background: '#FFFFFF',
  canvas: '#F8F8F8',
  field: '#F4F4F5',
  fieldStroke: '#E7E7EA',
  line: '#ECECEF',
  text: '#15171C',
  muted: '#9EA2AA',
  faint: '#C4C7CC',
  icon: '#B9BDC4',
  success: '#34C759',
  yellow: '#FFC83D',
  overlay: 'rgba(0, 0, 0, 0.22)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const figmaSpacing = {
  screenX: 28,
  headerTop: 54,
  headerBottom: 24,
  section: 24,
  cardGap: 16,
  inputGap: 22,
  bottomInset: 28,
} as const;

export const figmaRadius = {
  screen: 18,
  field: 8,
  card: 8,
  tile: 7,
  pill: 28,
  sheet: 18,
  circle: 999,
} as const;

export const figmaTypography = {
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.1,
  },
  header: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  tiny: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600' as const,
  },
} as const;

export const figmaShadow = {
  card: {
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  soft: {
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  float: {
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: Platform.OS === 'ios' ? 0.14 : 0.18,
    shadowRadius: 22,
    elevation: 10,
  },
} as const;

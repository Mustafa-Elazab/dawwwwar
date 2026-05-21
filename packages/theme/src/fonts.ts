import { Platform, I18nManager, TextStyle } from 'react-native';

type FontWeight = TextStyle['fontWeight'];

const fallbackLatin = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
const fallbackArabic = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });

const latinFamily = 'Nunito';
const arabicFamily = 'Cairo';

export const fontFamilies = {
  latin: {
    regular: latinFamily || fallbackLatin,
    medium: latinFamily || fallbackLatin,
    semibold: latinFamily || fallbackLatin,
    bold: latinFamily || fallbackLatin,
    black: latinFamily || fallbackLatin,
  },
  arabic: {
    regular: arabicFamily || fallbackArabic,
    medium: arabicFamily || fallbackArabic,
    semibold: arabicFamily || fallbackArabic,
    bold: arabicFamily || fallbackArabic,
    black: arabicFamily || fallbackArabic,
  },
} as const;

const mapWeight = (weight?: FontWeight) => {
  if (!weight) return 'regular';
  const w = typeof weight === 'string' ? weight : `${weight}`;
  if (w === '900' || w === '800') return 'black';
  if (w === '700') return 'bold';
  if (w === '600') return 'semibold';
  if (w === '500') return 'medium';
  return 'regular';
};

export const getFontFamily = (weight?: FontWeight, rtl = I18nManager.isRTL) => {
  const group = rtl ? fontFamilies.arabic : fontFamilies.latin;
  const key = mapWeight(weight);
  return group[key] ?? group.regular;
};

export const getArabicLineHeight = (lineHeight?: number, variant: 'display' | 'heading' | 'title' | 'body' | 'label' | 'caption' = 'body') => {
  if (!lineHeight) return lineHeight;
  const multipliers: Record<typeof variant, number> = {
    display: 1.05,
    heading: 1.08,
    title: 1.1,
    body: 1.15,
    label: 1.12,
    caption: 1.12,
  };
  return Math.round(lineHeight * multipliers[variant]);
};

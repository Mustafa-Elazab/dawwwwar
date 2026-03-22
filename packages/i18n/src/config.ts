import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';

export type AppLanguage = 'en' | 'ar';

export const LANGUAGE_STORAGE_KEY = 'dawwar_language';

export function initI18n(initialLanguage: AppLanguage = 'ar'): void {
  if (i18n.isInitialized) return;

  void i18n.use(initReactI18next).init({
    lng: initialLanguage,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });
}

export { i18n };

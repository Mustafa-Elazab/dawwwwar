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
    /**
     * Restrict to only the languages we ship. This also prevents i18next from
     * trying region-specific sub-tags (e.g. 'ar-EG') that Intl.PluralRules
     * may not cover on Hermes.
     */
    supportedLngs: ['en', 'ar'],
    /**
     * Strip region codes ('en-US' → 'en', 'ar-SA' → 'ar') so lookup always
     * hits a key in supportedLngs without needing Intl.PluralRules detection.
     */
    load: 'languageOnly',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    },
    /**
     * v4 keeps plural key suffixes as '_one', '_other', '_zero' etc.
     * Combined with `load: 'languageOnly'` this avoids the
     * "Your environment seems to not be standard browser environment" warning
     * that fires when Hermes's Intl.PluralRules support is incomplete.
     * Arabic has 6 plural forms — use keys: key_zero, key_one, key_two,
     * key_few, key_many, key_other in your translation files.
     */
    compatibilityJSON: 'v4',
  });
}

export { i18n };

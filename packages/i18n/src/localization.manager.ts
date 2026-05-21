import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { getStoredLanguage, setStoredLanguage } from './language.storage';
import { configureRTL, handleRTLRestart } from './rtl.manager';

import en from './locales/en.json';
import ar from './locales/ar.json';

export type AppLanguage = 'en' | 'ar';

export const DEFAULT_LANGUAGE: AppLanguage = 'ar';

export const getDeviceLanguage = (): AppLanguage => {
  try {
    const locales = RNLocalize.getLocales();
    return locales[0]?.languageCode === 'en' ? 'en' : 'ar';
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const setI18nConfig = async () => {
  console.log('[I18N] setI18nConfig called, isInitialized:', i18n.isInitialized);
  if (i18n.isInitialized) return Promise.resolve();

  let userLang = getStoredLanguage();
  console.log('[I18N] userLang from storage:', userLang);
  if (!userLang) {
    userLang = getDeviceLanguage();
    console.log('[I18N] userLang from device:', userLang);
  }

  console.log('[I18N] Calling configureRTL with:', userLang);
  configureRTL(userLang);

  console.log('[I18N] Initializing i18n instance');
  const logMissingKey = (lng: string | readonly string[], ns: string, key: string) => {
    if (!__DEV__) return;
    const lang = Array.isArray(lng) ? lng.join(',') : lng;
    console.warn(`[I18N] Missing key: ${lang}:${ns}.${key}`);
  };

  await i18n.use(initReactI18next).init({
    lng: userLang,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    load: 'languageOnly',
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
    saveMissing: __DEV__,
    returnEmptyString: false,
    returnNull: false,
    missingKeyHandler: (lng, ns, key) => logMissingKey(lng, ns, key),
    parseMissingKeyHandler: (key) => key,
  });
  console.log('[I18N] i18n instance initialized');
};

export const updateLanguage = async (language: AppLanguage) => {
  if (i18n.language === language) return;

  setStoredLanguage(language);

  if (!i18n.isInitialized) {
    await new Promise<void>((resolve) => {
      i18n.on('initialized', () => resolve());
    });
  }

  await i18n.changeLanguage(language);
  configureRTL(language);
  handleRTLRestart(language);
};

export { i18n };

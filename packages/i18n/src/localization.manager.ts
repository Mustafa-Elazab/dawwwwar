import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import { I18nManager } from 'react-native';
import { getStoredLanguage, setStoredLanguage } from './language.storage';
import { configureRTL, handleRTLRestart } from './rtl.manager';

import en from './locales/en.json';
import ar from './locales/ar.json';

export type AppLanguage = 'en' | 'ar';

export const DEFAULT_LANGUAGE: AppLanguage = 'ar';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const syncResourceBundles = () => {
  i18n.addResourceBundle('en', 'translation', en, true, true);
  i18n.addResourceBundle('ar', 'translation', ar, true, true);
};

const isAppLanguage = (language?: string | null): language is AppLanguage =>
  language === 'en' || language === 'ar';

export const getDeviceLanguage = (): AppLanguage => {
  try {
    const locales = RNLocalize.getLocales();
    return locales[0]?.languageCode === 'en' ? 'en' : 'ar';
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const setI18nConfig = async (preferredLanguage?: AppLanguage | null) => {
  let userLang: AppLanguage | null = isAppLanguage(preferredLanguage)
    ? preferredLanguage
    : getStoredLanguage();

  if (!userLang) {
    userLang = getDeviceLanguage();
  }

  setStoredLanguage(userLang);

  const shouldRestartForDirection = I18nManager.isRTL !== (userLang === 'ar');
  configureRTL(userLang);

  if (i18n.isInitialized) {
    syncResourceBundles();
    if (i18n.language !== userLang) {
      await i18n.changeLanguage(userLang);
    }
    if (shouldRestartForDirection) {
      handleRTLRestart(userLang);
    }
    return Promise.resolve();
  }

  await i18n.use(initReactI18next).init({
    lng: userLang,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    load: 'languageOnly',
    resources,
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
    returnNull: false,
    returnEmptyString: false,
    saveMissing: typeof __DEV__ !== 'undefined' ? __DEV__ : false,
    missingKeyHandler: (_lngs, _ns, key) => {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.warn(`[I18N] Missing translation key: ${key}`);
      }
    },
  });

  if (shouldRestartForDirection) {
    handleRTLRestart(userLang);
  }
};

export const updateLanguage = async (language: AppLanguage) => {
  const shouldRestartForDirection = I18nManager.isRTL !== (language === 'ar');

  if (i18n.language === language) {
    configureRTL(language);
    if (shouldRestartForDirection) {
      handleRTLRestart(language);
    }
    return;
  }

  setStoredLanguage(language);

  if (!i18n.isInitialized) {
    await new Promise<void>((resolve) => {
      i18n.on('initialized', () => resolve());
    });
  }

  await i18n.changeLanguage(language);
  configureRTL(language);
  if (shouldRestartForDirection) {
    handleRTLRestart(language);
  }
};

export { i18n };

import { MMKV } from 'react-native-mmkv';
import type { AppLanguage } from './localization.manager';

export const languageStorage = new MMKV({ id: 'localization-storage' });
export const LANGUAGE_KEY = 'APP_LANGUAGE';

export const getStoredLanguage = (): AppLanguage | null => {
  const lang = languageStorage.getString(LANGUAGE_KEY);
  return lang ? (lang as AppLanguage) : null;
};

export const setStoredLanguage = (lang: AppLanguage) => {
  languageStorage.set(LANGUAGE_KEY, lang);
};

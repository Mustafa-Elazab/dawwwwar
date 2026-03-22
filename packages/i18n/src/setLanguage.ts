import { I18nManager } from 'react-native';
import type { MMKV } from 'react-native-mmkv';
import type { AppLanguage } from './config';
import { LANGUAGE_STORAGE_KEY, i18n } from './config';

// This function changes the language.
// If the RTL direction needs to flip (en ↔ ar), the app MUST restart.
// The restart is handled by the caller using react-native-restart.

export interface SetLanguageResult {
  needsRestart: boolean;
}

export async function setAppLanguage(
  lang: AppLanguage,
  storage: MMKV,
  restartFn: () => void,
): Promise<SetLanguageResult> {
  storage.set(LANGUAGE_STORAGE_KEY, lang);

  const needsRTLFlip = (lang === 'ar') !== I18nManager.isRTL;

  await i18n.changeLanguage(lang);

  if (needsRTLFlip) {
    I18nManager.allowRTL(lang === 'ar');
    I18nManager.forceRTL(lang === 'ar');
    // Small delay to let i18n update before restart
    await new Promise((resolve) => setTimeout(resolve, 100));
    restartFn();
    return { needsRestart: true };
  }

  return { needsRestart: false };
}

export function getStoredLanguage(storage: MMKV): AppLanguage {
  const stored = storage.getString(LANGUAGE_STORAGE_KEY);
  return stored === 'en' ? 'en' : 'ar';
}

export function getDeviceLanguage(): AppLanguage {
  try {
    // react-native-localize returns sorted array, most preferred first
    const { getLocales } = require('react-native-localize');
    const locales: Array<{ languageCode: string }> = getLocales();
    return locales[0]?.languageCode === 'en' ? 'en' : 'ar';
  } catch {
    return 'ar'; // default to Arabic for Egyptian market
  }
}

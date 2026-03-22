// Config and initialization
export { initI18n, i18n, LANGUAGE_STORAGE_KEY } from './config';
export type { AppLanguage } from './config';

// Language switching
export { setAppLanguage, getStoredLanguage, getDeviceLanguage } from './setLanguage';

// Re-export react-i18next hook for convenience
export { useTranslation, Trans } from 'react-i18next';

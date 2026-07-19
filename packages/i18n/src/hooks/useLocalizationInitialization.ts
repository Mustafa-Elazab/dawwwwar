import { useState, useEffect } from 'react';
import { setI18nConfig, type AppLanguage } from '../localization.manager';

export const useLocalizationInitialization = (preferredLanguage?: AppLanguage | null) => {
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    setI18nConfig(preferredLanguage).then(() => setLanguageLoaded(true));
  }, [preferredLanguage]);

  return languageLoaded;
};

import { useState, useEffect } from 'react';
import { setI18nConfig } from '../localization.manager';

export const useLocalizationInitialization = () => {
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    setI18nConfig().then(() => setLanguageLoaded(true));
  }, []);

  return languageLoaded;
};

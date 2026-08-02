import React, { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useLocalizationInitialization } from '@dawwar/i18n';

import { registerFarhaTranslations } from './i18n/farhaResources';
import { AppProviders } from './providers';
import { FarhaPlannerApp } from '../features/planner/FarhaPlannerApp';

export function App() {
  const isI18nReady = useLocalizationInitialization();
  const [areFarhaStringsReady, setAreFarhaStringsReady] = useState(false);

  useEffect(() => {
    if (!isI18nReady) return;

    registerFarhaTranslations();
    setAreFarhaStringsReady(true);
  }, [isI18nReady]);

  useEffect(() => {
    if (!areFarhaStringsReady) return;

    void RNBootSplash.hide({ fade: true });
  }, [areFarhaStringsReady]);

  if (!isI18nReady || !areFarhaStringsReady) {
    return null;
  }

  return (
    <AppProviders>
      <FarhaPlannerApp />
    </AppProviders>
  );
}

export default App;

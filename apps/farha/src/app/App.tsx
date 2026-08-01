import React, { useEffect, useState } from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { useLocalizationInitialization } from '@dawwar/i18n';

import { registerFarhaTranslations } from './i18n/farhaResources';
import { AppProviders } from './providers';
import { FarhaPhase1App } from '../features/phase1/FarhaPhase1App';

export function App() {
  const isI18nReady = useLocalizationInitialization('ar');
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
      <FarhaPhase1App />
    </AppProviders>
  );
}

export default App;

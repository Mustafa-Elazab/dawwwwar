import React, { useEffect } from 'react';
import { useLocalizationInitialization, type AppLanguage } from '@dawwar/i18n';

import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from "react-native-bootsplash";
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { linking } from '../navigation/linking';
import { navigationRef } from '../navigation/navigationRef';
import { SafeAreaProviderCompat } from '@react-navigation/elements';
import { setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';
import { storage, StorageKeys } from '../core/storage/mmkv';
console.log('Nav Elements loaded check:', !!SafeAreaProviderCompat);
import '../utils/reactotron'; // Initialize Reactotron

import { NetworkStatusBanner } from '../components/NetworkStatusBanner';

import logger from '../utils/logger';

enableScreens(false);  // false = disable layout animations; prevents duplicate Animated node IDs under RN 0.84 New Architecture

const getBootstrapLanguage = (): AppLanguage => {
  const storedLanguage = storage.getString(StorageKeys.APP_LANGUAGE);
  return storedLanguage === 'en' || storedLanguage === 'ar' ? storedLanguage : 'ar';
};

export function App() {
  const isI18nReady = useLocalizationInitialization(getBootstrapLanguage());

  useEffect(() => {
    logger.log('[App] Mounted');

    // Setup foreground handler; permission is requested after customer login.
    if (!USE_MOCK_API) {
      setupForegroundNotifications();
    }
  }, []);

  logger.log('[App] Rendering', { isI18nReady });

  if (!isI18nReady) {
    return null;
  }

  return (
    <AppProviders>
      <NetworkStatusBanner />
      <NavigationContainer 
        ref={navigationRef}
        linking={linking} 
        onStateChange={(state) => {
          logger.log('[NavigationContainer] State changed:', state);
        }}
        onReady={() => {
          logger.log('[NavigationContainer] Ready');
          void RNBootSplash.hide({ fade: true });
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

export default App;

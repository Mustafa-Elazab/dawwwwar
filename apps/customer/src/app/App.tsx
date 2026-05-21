import React, { useEffect } from 'react';
import { useLocalizationInitialization } from '@dawwar/i18n';

import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { linking } from '../navigation/linking';
import { navigationRef } from '../navigation/navigationRef';
import { SafeAreaProviderCompat } from '@react-navigation/elements';
import {
  requestPushNotificationPermission,
  setupForegroundNotifications,
} from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';
console.log('Nav Elements loaded check:', !!SafeAreaProviderCompat);
import '../utils/reactotron'; // Initialize Reactotron

import { NetworkStatusBanner } from '../components/NetworkStatusBanner';

import logger from '../utils/logger';

enableScreens(false); // false = disable layout animations; prevents duplicate Animated node IDs under RN 0.84 New Architecture

export function App() {
  const isI18nReady = useLocalizationInitialization();

  useEffect(() => {
    logger.log('[App] Mounted');

    // Request push notification permission and setup foreground handler
    if (!USE_MOCK_API) {
      void requestPushNotificationPermission();
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
        onStateChange={state => {
          logger.log('[NavigationContainer] State changed:', state);
        }}
        onReady={() => {
          logger.log('[NavigationContainer] Ready');
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

export default App;

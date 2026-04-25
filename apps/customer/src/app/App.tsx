import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { linking } from '../navigation/linking';
import { SafeAreaProviderCompat } from '@react-navigation/elements';
import { requestPushNotificationPermission, setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';
console.log('Nav Elements loaded check:', !!SafeAreaProviderCompat);
import '../utils/reactotron'; // Initialize Reactotron

enableScreens(false);  // false = disable layout animations; prevents duplicate Animated node IDs under RN 0.84 New Architecture

export function App() {
  useEffect(() => {
    console.log('[App] Mounted');

    // Request push notification permission and setup foreground handler
    if (!USE_MOCK_API) {
      void requestPushNotificationPermission();
      setupForegroundNotifications();
    }
  }, []);

  console.log('[App] Rendering');

  return (
    <AppProviders>
      <NavigationContainer linking={linking} onStateChange={(state) => {
        console.log('[NavigationContainer] State changed:', state);
      }}>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { requestPushNotificationPermission, setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';

enableScreens();

export function App() {
  useEffect(() => {
    // Request push notification permission and setup foreground handler
    if (!USE_MOCK_API) {
      void requestPushNotificationPermission();
      setupForegroundNotifications();
    }
  }, []);

  return (
    <AppProviders>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

import React, { useEffect, useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { storage } from '../core/storage/mmkv';
import { setI18nConfig } from '@dawwar/i18n';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { requestPushNotificationPermission, setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';

enableScreens();

export function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await setI18nConfig();
      setIsI18nReady(true);
    };
    init();

    // Request push notification permission and setup foreground handler
    if (!USE_MOCK_API) {
      void requestPushNotificationPermission();
      setupForegroundNotifications();
    }
  }, []);

  if (!isI18nReady) return null;

  return (
    <AppProviders>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

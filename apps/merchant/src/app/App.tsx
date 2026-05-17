import React, { useEffect, useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import { storage } from '../core/storage/mmkv';
import { setI18nConfig } from '@dawwar/i18n';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { requestPushNotificationPermission, setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';

enableScreens(false);

export function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    console.log('[APP] Starting initialization');
    const init = async () => {
      try {
        console.log('[APP] Calling setI18nConfig');
        await Promise.race([
          setI18nConfig(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('i18n timeout')), 3000))
        ]);
        console.log('[APP] setI18nConfig finished');
      } catch (err) {
        console.error('[APP] setI18nConfig error or timeout:', err);
      } finally {
        setIsI18nReady(true);
      }
    };
    init();

    if (!USE_MOCK_API) {
      console.log('[APP] Setting up notifications');
      void requestPushNotificationPermission();
      setupForegroundNotifications();
    }
  }, []);

  console.log('[APP] Render, isI18nReady:', isI18nReady);

  if (!isI18nReady) {
    console.log('[APP] Rendering null (white screen) because isI18nReady is false');
    return null;
  }

  console.log('[APP] Rendering AppProviders');
  return (
    <AppProviders>
      <NavigationContainer
        onReady={() => {
          console.log('[NavigationContainer] Ready, hiding BootSplash');
          void RNBootSplash.hide({ fade: true });
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

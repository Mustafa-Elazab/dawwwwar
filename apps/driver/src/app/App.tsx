import React, { useEffect, useState } from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import { getStoredLanguage, setI18nConfig, type AppLanguage } from '@dawwar/i18n';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { requestPushNotificationPermission, setupForegroundNotifications } from '../utils/notifications';
import { USE_MOCK_API } from '../core/api/config';
import '../utils/reactotron';

enableScreens(false);

const getBootstrapLanguage = (): AppLanguage => {
  const storedLanguage = getStoredLanguage();
  return storedLanguage === 'en' || storedLanguage === 'ar' ? storedLanguage : 'ar';
};

export function App() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.race([
          setI18nConfig(getBootstrapLanguage()),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('i18n initialization timeout')), 3000),
          ),
        ]);
      } catch (err) {
        console.error('[App] i18n initialization error:', err);
      } finally {
        setIsI18nReady(true);
      }
    };
    void init();

    // Request push notification permission and setup foreground handler
    if (!USE_MOCK_API) {
      void requestPushNotificationPermission();
      setupForegroundNotifications();
    }
  }, []);

  if (!isI18nReady) return null;

  return (
    <AppProviders>
      <NavigationContainer
        onReady={() => {
          void RNBootSplash.hide({ fade: true });
        }}
      >
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

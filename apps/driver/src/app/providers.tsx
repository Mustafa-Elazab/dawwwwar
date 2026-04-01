import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@dawwar/theme';
import { I18nextProvider } from 'react-i18next';
import { initI18n, getStoredLanguage, i18n } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { store } from '../store';
import { storage, StorageKeys } from '../core/storage/mmkv';
import { setThemeMode, setLanguage } from '../store/slices/ui.slice';
import { ThemeMode } from '@dawwar/types';

// Initialize i18n before the component tree renders
const storedLang = getStoredLanguage(storage as any);
initI18n(storedLang);

// Initialize theme from storage
const storedMode = storage.getString(StorageKeys.THEME_MODE);
if (storedMode && Object.values(ThemeMode).includes(storedMode as ThemeMode)) {
  store.dispatch(setThemeMode(storedMode as ThemeMode));
}
if (storedLang) {
  store.dispatch(setLanguage(storedLang as any));
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error instanceof Error &&
          (error.message === 'NOT_FOUND' || error.message === 'USER_NOT_FOUND')
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60_000,
      gcTime: 10 * 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider storage={storage as any}>
            <SafeAreaProvider>
              <I18nextProvider i18n={i18n}>
                {children}
                <Toast />
              </I18nextProvider>
            </SafeAreaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

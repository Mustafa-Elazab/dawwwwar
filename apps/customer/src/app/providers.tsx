import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@dawwar/theme';
import { initI18n, getStoredLanguage } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { store } from '../store';
import { storage, StorageKeys } from '../core/storage/mmkv';
import { finishLoading } from '../store/slices/auth.slice';

// Initialize i18n before the component tree renders
const storedLang = getStoredLanguage(storage as any);
initI18n(storedLang);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry 404s
        if (
          error instanceof Error &&
          (error.message === 'NOT_FOUND' || error.message === 'USER_NOT_FOUND')
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60_000,   // 5 minutes
      gcTime: 10 * 60_000,     // 10 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    // Try to restore session from MMKV on app launch
    const hasToken = !!storage.getString(StorageKeys.ACCESS_TOKEN);
    if (!hasToken) {
      // No token — not authenticated, stop loading
      store.dispatch(finishLoading());
    }
    // If token exists, RootNavigator will handle validation
    // For Phase 1 (mock): we just trust the token is valid
    if (hasToken) {
      store.dispatch(finishLoading());
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider storage={storage as any}>
            <SafeAreaProvider>
              {children}
              <Toast />
            </SafeAreaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

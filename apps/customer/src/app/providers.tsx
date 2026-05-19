import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@dawwar/theme';
import { getStoredLanguage } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { AppErrorBoundary } from '@dawwar/ui';
import { ApiClientProvider } from '@dawwar/api-client';
import { store, persistor } from '../store';
import { storage, StorageKeys } from '../core/storage/mmkv';
import { finishLoading, setUser, setGuestMode } from '../store/slices/auth.slice';
import { api, publicApi } from '../core/api/client';
import { authApi } from '../features/auth/core/api';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PersistGate } from 'redux-persist/integration/react';
import logger from '../utils/logger';

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
    logger.log('[AppProviders] Mounted');

    const restoreSession = async () => {
      const token = storage.getString(StorageKeys.ACCESS_TOKEN);
      logger.log('[AppProviders] Token exists:', !!token);

      if (!token) {
        store.dispatch(setGuestMode());
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          store.dispatch(setUser(res.data));
        } else {
          store.dispatch(setGuestMode());
        }
      } catch (err: unknown) {
        logger.error('[AppProviders] restoreSession error:', err);
        // On error (e.g. token expired), fall back to guest mode
        store.dispatch(setGuestMode());
      }
    };

    void restoreSession();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppErrorBoundary>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ApiClientProvider client={api} publicClient={publicApi}>
                <ThemeProvider storage={storage}>
                  <SafeAreaProvider>
                    {children}
                    <Toast />
                  </SafeAreaProvider>
                </ThemeProvider>
              </ApiClientProvider>
            </QueryClientProvider>
          </PersistGate>
        </ReduxProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
  );
}

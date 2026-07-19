import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@dawwar/theme';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { AppErrorBoundary } from '../../../../packages/ui/src/templates/AppErrorBoundary';
import { store } from '../store';
import { storage, StorageKeys } from '../core/storage/mmkv';
import { setThemeMode } from '../store/slices/ui.slice';
import { setUser, setLoading } from '../store/slices/auth.slice';
import { authApi } from '../features/auth/core/api';
import { api } from '../core/api/client';
import { ThemeMode } from '@dawwar/types';
import { ApiClientProvider } from '@dawwar/api-client';

// Initialize theme from storage
const storedMode = storage.getString(StorageKeys.THEME_MODE);
if (storedMode && Object.values(ThemeMode).includes(storedMode as ThemeMode)) {
  store.dispatch(setThemeMode(storedMode as ThemeMode));
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
  console.log('[AppProviders] Rendering');
  useEffect(() => {
    console.log('[AppProviders] useEffect mounted, starting restoreSession');
    const restoreSession = async () => {
      try {
        console.log('[AppProviders] Reading token from storage');
        const token = storage.getString(StorageKeys.ACCESS_TOKEN);
        console.log('[AppProviders] Token retrieved:', !!token);

        if (!token) {
          console.log('[AppProviders] No token, setting loading false');
          store.dispatch(setLoading(false));
          return;
        }

        console.log('[AppProviders] Fetching /auth/me');
        const res = await authApi.getMe();
        console.log('[AppProviders] /auth/me response:', res.success);
        
        if (res.success && res.data) {
          let hasStore = false;
          try {
            console.log('[AppProviders] Checking merchant profile');
            const merchantRes = await api.get('/merchants/my');
            hasStore = !!merchantRes.data;
            console.log('[AppProviders] Merchant profile check:', hasStore);
          } catch (err: any) {
            console.log('[AppProviders] Merchant profile check failed, treating as no store');
            hasStore = false;
          }
          console.log('[AppProviders] Dispatching setUser');
          store.dispatch(setUser({ user: res.data, hasStore }));
        }
      } catch (err) {
        console.error('[AppProviders] restoreSession error:', err);
      } finally {
        console.log('[AppProviders] Setting loading false');
        store.dispatch(setLoading(false));
      }
    };

    void restoreSession();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppErrorBoundary>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <ApiClientProvider client={api}>
              <ThemeProvider storage={storage}>
                <SafeAreaProvider>
                  <I18nextProvider i18n={i18n}>
                    {children}
                    <Toast />
                  </I18nextProvider>
                </SafeAreaProvider>
              </ThemeProvider>
            </ApiClientProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
  );
}

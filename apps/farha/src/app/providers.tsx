import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@dawwar/theme';
import { AppErrorBoundary } from '@dawwar/ui';

import { farhaStorage } from './storage';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppErrorBoundary>
        <ThemeProvider storage={farhaStorage}>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
  );
}

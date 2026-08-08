import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@dawwar/theme';
import { AppErrorBoundary } from '@dawwar/ui';

import { farhaStorage } from './storage';

const farhaLightColors = {
  background: '#7A2039',
  surface: '#F7E3E2',
  surfaceVariant: '#FDF6F3',
  card: '#FDF6F3',
  border: '#E6BFC2',
  borderLight: '#F1D4D2',
  borderFocus: '#7A2039',
  text: '#5C1B2E',
  textSecondary: '#B08A90',
  textTertiary: '#C98995',
  textInverse: '#FDF6F3',
  textLink: '#7A2039',
  primary: '#7A2039',
  primaryDark: '#5C1B2E',
  primaryLight: '#F7E3E2',
  primaryMuted: '#C98995',
  primaryText: '#FDF6F3',
  icon: '#B08A90',
  iconActive: '#7A2039',
  iconInverse: '#FDF6F3',
  placeholder: '#B08A90',
  shadow: 'rgba(92, 27, 46, 0.18)',
  tabBar: '#FDF6F3',
  tabBarBorder: '#E6BFC2',
  tabBarIcon: '#C98995',
  tabBarIconActive: '#7A2039',
  statusBarBg: '#7A2039',
} as const;

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppErrorBoundary>
        <ThemeProvider storage={farhaStorage} lightColorOverrides={farhaLightColors}>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </ThemeProvider>
      </AppErrorBoundary>
    </GestureHandlerRootView>
  );
}

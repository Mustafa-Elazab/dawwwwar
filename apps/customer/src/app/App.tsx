import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './providers';
import { RootNavigator } from '../navigation/RootNavigator';
import { linking } from '../navigation/linking';

enableScreens();  // must be called before NavigationContainer renders

export function App() {
  return (
    <AppProviders>
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
    </AppProviders>
  );
}

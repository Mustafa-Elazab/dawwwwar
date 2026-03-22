import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { WALLET_ROUTES } from '../routes';
import type { WalletStackParamList } from '../types';
import { WalletScreen, TransactionsScreen } from '../placeholders';

const Stack = createStackNavigator<WalletStackParamList>();

export function WalletStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={WALLET_ROUTES.WALLET} component={WalletScreen} />
      <Stack.Screen name={WALLET_ROUTES.TRANSACTIONS} component={TransactionsScreen} />
    </Stack.Navigator>
  );
}

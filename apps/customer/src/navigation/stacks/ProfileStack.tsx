import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PROFILE_ROUTES } from '../routes';
import type { ProfileStackParamList } from '../types';
import { ProfileScreen, AddressesScreen, AddAddressScreen, LanguageScreen, AppearanceScreen } from '../placeholders';

const Stack = createStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PROFILE_ROUTES.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={PROFILE_ROUTES.ADDRESSES} component={AddressesScreen} />
      <Stack.Screen name={PROFILE_ROUTES.ADD_ADDRESS} component={AddAddressScreen} />
      <Stack.Screen name={PROFILE_ROUTES.LANGUAGE} component={LanguageScreen} />
      <Stack.Screen name={PROFILE_ROUTES.APPEARANCE} component={AppearanceScreen} />
    </Stack.Navigator>
  );
}

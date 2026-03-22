import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME_ROUTES } from '../routes';
import type { HomeStackParamList } from '../types';
import { HomeScreen, SearchScreen, CategoryMerchantsScreen, MerchantDetailScreen } from '../placeholders';

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME_ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={HOME_ROUTES.SEARCH} component={SearchScreen} />
      <Stack.Screen name={HOME_ROUTES.CATEGORY_MERCHANTS} component={CategoryMerchantsScreen} />
      <Stack.Screen name={HOME_ROUTES.MERCHANT_DETAIL} component={MerchantDetailScreen} />
    </Stack.Navigator>
  );
}

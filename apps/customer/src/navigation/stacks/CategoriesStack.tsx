import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CATEGORY_ROUTES, HOME_ROUTES } from '../routes';
import type { CategoriesStackParamList } from '../types';
import { CategoriesScreen, CategoryMerchantsScreen, MerchantDetailScreen } from '../placeholders';

const Stack = createStackNavigator<CategoriesStackParamList>();

export function CategoriesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={CATEGORY_ROUTES.CATEGORIES} component={CategoriesScreen} />
      <Stack.Screen name={HOME_ROUTES.CATEGORY_MERCHANTS} component={CategoryMerchantsScreen} />
      <Stack.Screen name={HOME_ROUTES.MERCHANT_DETAIL} component={MerchantDetailScreen} />
    </Stack.Navigator>
  );
}

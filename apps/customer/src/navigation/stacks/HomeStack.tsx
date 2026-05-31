import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME_ROUTES, PROFILE_ROUTES } from '../routes';
import type { HomeStackParamList } from '../types';
import { HomeScreen, SearchScreen, CategoriesScreen, CategoryMerchantsScreen, MerchantDetailScreen, ProductDetailScreen, NotificationsScreen, LocationPickerScreen, NearbyMerchantsScreen, PopularProductsScreen } from '../placeholders';

const Stack = createStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME_ROUTES.HOME} component={HomeScreen} />
      <Stack.Screen name={HOME_ROUTES.CATEGORIES} component={CategoriesScreen} />
      <Stack.Screen name={HOME_ROUTES.SEARCH} component={SearchScreen} />
      <Stack.Screen name={HOME_ROUTES.CATEGORY_MERCHANTS} component={CategoryMerchantsScreen} />
      <Stack.Screen name={HOME_ROUTES.MERCHANT_DETAIL} component={MerchantDetailScreen} />
      <Stack.Screen name={HOME_ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
      <Stack.Screen name={HOME_ROUTES.LOCATION_PICKER} component={LocationPickerScreen} />
      <Stack.Screen name={HOME_ROUTES.NEARBY_MERCHANTS} component={NearbyMerchantsScreen} />
      <Stack.Screen name={HOME_ROUTES.POPULAR_PRODUCTS} component={PopularProductsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

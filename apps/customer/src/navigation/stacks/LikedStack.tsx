import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HOME_ROUTES, LIKED_ROUTES } from '../routes';
import type { LikedStackParamList } from '../types';
import { LikedScreen } from '../../features/liked/screens/LikedScreen';
import { ProductDetailScreen } from '../../features/product/screens/ProductDetailScreen';

const Stack = createStackNavigator<LikedStackParamList>();

export function LikedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={LIKED_ROUTES.LIKED} component={LikedScreen} />
      <Stack.Screen name={HOME_ROUTES.PRODUCT_DETAIL} component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}

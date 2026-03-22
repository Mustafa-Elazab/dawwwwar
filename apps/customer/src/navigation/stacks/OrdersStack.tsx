import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ORDER_ROUTES } from '../routes';
import type { OrdersStackParamList } from '../types';
import { OrdersListScreen, OrderDetailScreen, TrackingScreen } from '../placeholders';

const Stack = createStackNavigator<OrdersStackParamList>();

export function OrdersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ORDER_ROUTES.ORDERS_LIST} component={OrdersListScreen} />
      <Stack.Screen name={ORDER_ROUTES.ORDER_DETAIL} component={OrderDetailScreen} />
      <Stack.Screen name={ORDER_ROUTES.TRACKING} component={TrackingScreen} />
    </Stack.Navigator>
  );
}

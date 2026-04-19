import React from 'react';
import { View } from 'react-native';
import { Text } from '@dawwar/ui';
import { MERCHANT_ROUTES } from './routes';

function createPlaceholder(name: string, taskId: number) {
  return function PlaceholderScreen() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Text variant="h3">{name}</Text>
        <Text variant="body2" color="#666">To be built in Task {taskId}</Text>
      </View>
    );
  };
}

// Auth placeholders (borrowed from driver, they will use customer equivalents or shared)
export const PendingApprovalScreen = createPlaceholder(MERCHANT_ROUTES.ORDERS, 23); // Reuse to pass auth checks

// Merchant tabs
export { MerchantOrdersScreen } from '../features/orders/screens/MerchantOrdersScreen';
export { ProductsScreen } from '../features/products/screens/ProductsScreen';
export { AddEditProductScreen } from '../features/products/screens/AddEditProductScreen';
export { AnalyticsScreen } from '../features/analytics/screens/AnalyticsScreen';
export { MerchantProfileScreen } from '../features/profile/screens/MerchantProfileScreen';

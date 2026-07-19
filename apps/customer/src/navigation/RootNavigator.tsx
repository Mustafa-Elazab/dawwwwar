import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  selectIsLoading,
} from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { CustomerTabs } from './CustomerTabs';
import { CheckoutModal, CustomOrderMapPickerScreen, CustomOrderModal, PaymentWebViewScreen } from './placeholders';
import { MODAL_ROUTES, PAYMENT_ROUTES } from './routes';
import type { RootParamList } from './types';
import { JS_SplashScreen } from '../features/auth/components/SplashScreen';

const Root = createStackNavigator<RootParamList>();

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  // Debug logging
  useEffect(() => {
    console.log('[RootNavigator] Auth state:', {
      isAuthenticated,
      isLoading,
    });
  }, [isAuthenticated, isLoading]);

  // Show loading while session is being restored
  if (isLoading) {
    return <JS_SplashScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Profile fields are optional for the launch MVP, so authenticated users enter the app.
  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      <Root.Screen name="CustomerTabs" component={CustomerTabs} />
      <Root.Screen name={MODAL_ROUTES.CHECKOUT} component={CheckoutModal} />
      <Root.Screen name={MODAL_ROUTES.CUSTOM_ORDER} component={CustomOrderModal} />
      <Root.Screen name={MODAL_ROUTES.CUSTOM_ORDER_MAP_PICKER} component={CustomOrderMapPickerScreen} />
      <Root.Screen name={PAYMENT_ROUTES.PAYMENT_WEBVIEW} component={PaymentWebViewScreen} />
    </Root.Navigator>
  );
}

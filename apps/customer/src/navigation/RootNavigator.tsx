import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
} from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { CustomerTabs } from './CustomerTabs';
import { CartModal, CheckoutModal, CustomOrderModal } from './placeholders';
import { MODAL_ROUTES } from './routes';
import type { RootParamList } from './types';
import { CompleteProfileScreen } from '../features/auth/screens/CompleteProfileScreen';
import { JS_SplashScreen } from '../features/auth/components/SplashScreen';

const Root = createStackNavigator<RootParamList>();

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const user = useAppSelector(selectUser);

  const hasName = !!user?.name;

  // Debug logging
  useEffect(() => {
    console.log('[RootNavigator] Auth state:', {
      isAuthenticated,
      isLoading,
      hasName,
    });
  }, [isAuthenticated, isLoading, hasName]);

  // Show loading while session is being restored
  if (isLoading) {
    return <JS_SplashScreen />;
  }

  // Not authenticated → show auth flow (Phone -> OTP)
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Authenticated but missing name → Complete Profile
  if (!hasName) {
    return <CompleteProfileScreen />;
  }

  // Authenticated and has name → Main App
  return (
    <Root.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Root.Screen name="CustomerTabs" component={CustomerTabs} />
      <Root.Screen name={MODAL_ROUTES.CART} component={CartModal} />
      <Root.Screen name={MODAL_ROUTES.CHECKOUT} component={CheckoutModal} />
      <Root.Screen name={MODAL_ROUTES.CUSTOM_ORDER} component={CustomOrderModal} />
    </Root.Navigator>
  );
}

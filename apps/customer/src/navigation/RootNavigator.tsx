import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import {
  selectIsAuthenticated,
  selectIsLoading,
  selectRole,
  selectIsApproved,
} from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { CustomerTabs } from './CustomerTabs';
import { CartModal, CheckoutModal, CustomOrderModal, PendingApprovalScreen } from './placeholders';
import { MODAL_ROUTES } from './routes';
import type { RootParamList } from './types';
import { LoadingSpinner } from '@dawwar/ui';
import { Role } from '@dawwar/types';

const Root = createStackNavigator<RootParamList>();

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const role = useAppSelector(selectRole);
  const isApproved = useAppSelector(selectIsApproved);

  // Debug logging
  useEffect(() => {
    console.log('[RootNavigator] Auth state:', {
      isAuthenticated,
      isLoading,
      role,
      isApproved,
    });
  }, [isAuthenticated, isLoading, role, isApproved]);

  console.log('[RootNavigator] Rendering with:', { isAuthenticated, isLoading, role, isApproved });

  // Show loading while session is being restored
  if (isLoading) {
    console.log('[RootNavigator] Showing LoadingSpinner');
    return <LoadingSpinner fullscreen message="Loading..." />;
  }

  // Not authenticated → show auth flow
  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  // Authenticated but awaiting approval
  if (
    (role === Role.MERCHANT || role === Role.DRIVER) &&
    !isApproved
  ) {
    return <PendingApprovalScreen />;
  }

  // Authenticated and approved (or CUSTOMER role — no approval needed)
  return (
    <Root.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Root.Screen name="CustomerTabs" component={CustomerTabs} />
      <Root.Screen name={MODAL_ROUTES.CART} component={CartModal} />
      <Root.Screen name={MODAL_ROUTES.CHECKOUT} component={CheckoutModal} />
      <Root.Screen name={MODAL_ROUTES.CUSTOM_ORDER} component={CustomOrderModal} />
    </Root.Navigator>
  );
}

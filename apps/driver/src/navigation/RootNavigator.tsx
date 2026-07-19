import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectIsLoading, selectIsApproved } from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { DriverTabs } from './DriverTabs';
import { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';
import { JS_SplashScreen } from '../features/auth/components/SplashScreen';

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isApproved = useAppSelector(selectIsApproved);

  if (isLoading) {
    return <JS_SplashScreen />;
  }

  // 1. Not authenticated → show auth flow (Phone -> OTP)
  if (!isAuthenticated) return <AuthNavigator />;

  // 2. Authenticated but not approved yet → Pending screen
  if (!isApproved) return <PendingApprovalScreen />;

  // 3. Approved driver → Main App
  return <DriverTabs />;
}

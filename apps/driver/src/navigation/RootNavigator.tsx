import React from 'react';
import { View } from 'react-native';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectIsLoading, selectRole, selectIsApproved } from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { DriverTabs } from './DriverTabs';
import { PendingApprovalScreen } from './placeholders';
import { LoadingSpinner } from '@dawwar/ui';
import { Role } from '@dawwar/types';

export function RootNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const role = useAppSelector(selectRole);
  const isApproved = useAppSelector(selectIsApproved);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner />
      </View>
    );
  }

  // 1. Not authenticated → show auth flow (Phone -> OTP)
  if (!isAuthenticated) return <AuthNavigator />;

  // 2. Authenticated but haven't selected role yet → Role selection
  if (role === Role.CUSTOMER) return <AuthNavigator />;

  // 3. Selected DRIVER but not approved yet → Pending screen
  if (!isApproved) return <PendingApprovalScreen />;

  // 4. Approved driver → Main App
  return <DriverTabs />;
}

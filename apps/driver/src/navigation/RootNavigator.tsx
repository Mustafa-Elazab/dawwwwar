import React from 'react';
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

  if (isLoading) return <LoadingSpinner fullscreen />;

  // Only DRIVER role allowed in this app
  if (!isAuthenticated) return <AuthNavigator />;
  if (role !== Role.DRIVER) return <PendingApprovalScreen />;
  if (!isApproved) return <PendingApprovalScreen />;
  return <DriverTabs />;
}

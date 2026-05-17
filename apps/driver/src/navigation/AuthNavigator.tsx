import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PhoneScreen, OtpScreen, RoleScreen, PendingApprovalScreen } from './placeholders';
import type { AuthStackParamList } from './types';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated, selectRole } from '../store/slices/auth.slice';
import { Role } from '@dawwar/types';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);

  const initialRouteName = isAuthenticated && role === Role.CUSTOMER 
    ? 'RoleScreen' 
    : 'PhoneScreen';

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PhoneScreen" component={PhoneScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="RoleScreen" component={RoleScreen} />
      <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
}

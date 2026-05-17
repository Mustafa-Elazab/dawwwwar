import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/slices/auth.slice';
import { PhoneScreen } from '../features/auth/screens/PhoneScreen';
import { OtpScreen } from '../features/auth/screens/OtpScreen';
import { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';
import { CreateStoreScreen } from '../features/auth/screens/CreateStoreScreen';
import { RejectedScreen } from '../features/auth/screens/RejectedScreen';
import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "CreateStoreScreen" : "PhoneScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PhoneScreen" component={PhoneScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
      <Stack.Screen name="CreateStoreScreen" component={CreateStoreScreen} />
      <Stack.Screen name="RejectedScreen" component={RejectedScreen} />
    </Stack.Navigator>
  );
}

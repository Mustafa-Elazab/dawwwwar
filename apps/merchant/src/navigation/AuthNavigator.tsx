import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PhoneScreen, OtpScreen, RoleScreen, PendingApprovalScreen } from './placeholders';
import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
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

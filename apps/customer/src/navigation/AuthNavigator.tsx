import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_ROUTES } from './routes';
import type { AuthStackParamList } from './types';
import { AuthSelectionScreen } from '../features/auth/screens/AuthSelectionScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { RegisterScreen } from '../features/auth/screens/RegisterScreen';
import { OtpScreen } from '../features/auth/screens/OtpScreen';
import {
  RoleScreen,
  PendingApprovalScreen,
  CustomerOnboardingScreen,
  MerchantOnboardingScreen,
  DriverOnboardingScreen,
} from './placeholders';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  useEffect(() => {
    console.log('[AuthNavigator] Rendering auth stack');
  }, []);

  console.log('[AuthNavigator] Routes:', AUTH_ROUTES);

  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.AUTH_SELECTION}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        cardStyle: { flex: 1 },
      }}
    >
      <Stack.Screen name={AUTH_ROUTES.AUTH_SELECTION} component={AuthSelectionScreen} />
      <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
      <Stack.Screen name={AUTH_ROUTES.REGISTER} component={RegisterScreen} />
      <Stack.Screen name={AUTH_ROUTES.OTP} component={OtpScreen} />
      <Stack.Screen name={AUTH_ROUTES.ROLE} component={RoleScreen} />
      <Stack.Screen name={AUTH_ROUTES.CUSTOMER_ONBOARDING} component={CustomerOnboardingScreen} />
      <Stack.Screen name={AUTH_ROUTES.MERCHANT_ONBOARDING} component={MerchantOnboardingScreen} />
      <Stack.Screen name={AUTH_ROUTES.DRIVER_ONBOARDING} component={DriverOnboardingScreen} />
      <Stack.Screen name={AUTH_ROUTES.PENDING_APPROVAL} component={PendingApprovalScreen} />
    </Stack.Navigator>
  );
}

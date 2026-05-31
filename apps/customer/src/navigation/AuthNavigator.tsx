import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AUTH_ROUTES, PROFILE_ROUTES } from './routes';
import type { AuthStackParamList } from './types';
import { PhoneScreen } from '../features/auth/screens/PhoneScreen';
import { AuthSplashScreen } from '../features/auth/screens/SplashScreen';
import { OnboardingScreen } from '../features/auth/screens/OnboardingScreen';
import { TermsScreen, PrivacyScreen } from './placeholders';
import { OtpScreen } from '../features/auth/screens/OtpScreen';

const Stack = createStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  useEffect(() => {
    console.log('[AuthNavigator] Rendering simplified auth stack');
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={AUTH_ROUTES.SPLASH}
      screenOptions={{
        headerShown: false,
        cardStyle: { flex: 1 },
      }}
    >
      <Stack.Screen name={AUTH_ROUTES.SPLASH} component={AuthSplashScreen} />
      <Stack.Screen name={AUTH_ROUTES.ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={AUTH_ROUTES.PHONE} component={PhoneScreen} />
      <Stack.Screen name={AUTH_ROUTES.OTP} component={OtpScreen} />
      <Stack.Screen name={PROFILE_ROUTES.TERMS} component={TermsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.PRIVACY} component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

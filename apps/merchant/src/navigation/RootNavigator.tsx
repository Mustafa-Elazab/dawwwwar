import React from 'react';
import { useAppSelector } from '../store/hooks';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  selectIsAuthenticated, 
  selectIsLoading, 
  selectIsApproved,
  selectIsRejected,
  selectHasStore,
  selectUser
} from '../store/slices/auth.slice';
import { AuthNavigator } from './AuthNavigator';
import { MerchantTabs } from './MerchantTabs';
import { PendingApprovalScreen } from '../features/auth/screens/PendingApprovalScreen';
import { CreateStoreScreen } from '../features/auth/screens/CreateStoreScreen';
import { RejectedScreen } from '../features/auth/screens/RejectedScreen';
import { CompleteProfileScreen } from '../features/auth/screens/CompleteProfileScreen';
import { JS_SplashScreen } from '../features/auth/components/SplashScreen';
import { TermsScreen } from '../features/legal/screens/TermsScreen';
import { PrivacyScreen } from '../features/legal/screens/PrivacyScreen';

const RootStack = createStackNavigator();
const ApprovalStack = createStackNavigator();

function ApprovalNavigator() {
  const isRejected = useAppSelector(selectIsRejected);
  return (
    <ApprovalStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isRejected ? "RejectedScreen" : "PendingApprovalScreen"}>
      <ApprovalStack.Screen name="PendingApprovalScreen" component={PendingApprovalScreen} />
      <ApprovalStack.Screen name="RejectedScreen" component={RejectedScreen} />
    </ApprovalStack.Navigator>
  );
}

function MainContent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const isApproved = useAppSelector(selectIsApproved);
  const isRejected = useAppSelector(selectIsRejected);
  const hasStore = useAppSelector(selectHasStore);
  const user = useAppSelector(selectUser);

  const hasName = !!user?.name;

  console.log('[RootNavigator] Render', { isAuthenticated, isLoading, isApproved, isRejected, hasStore, hasName });

  // 1. Show Splash Screen while session is being restored
  if (isLoading) {
    console.log('[RootNavigator] Rendering JS_SplashScreen');
    return <JS_SplashScreen />;
  }

  // 2. Not authenticated → show auth flow (Phone -> OTP)
  if (!isAuthenticated) {
    console.log('[RootNavigator] Rendering AuthNavigator');
    return <AuthNavigator />;
  }

  // 3. Authenticated but missing name → Complete Profile
  if (!hasName) {
    console.log('[RootNavigator] Rendering CompleteProfileScreen');
    return <CompleteProfileScreen />;
  }

  // 4. Authenticated but no store yet → Create store
  if (!hasStore) {
    console.log('[RootNavigator] Rendering AuthNavigator (at CreateStoreScreen)');
    return <AuthNavigator />;
  }

  // 5. Authenticated and has store, but pending approval or rejected
  if (isRejected || !isApproved) {
    console.log('[RootNavigator] Rendering ApprovalNavigator');
    return <ApprovalNavigator />;
  }

  // 6. Approved merchant with store → Main App
  console.log('[RootNavigator] Rendering MerchantTabs');
  return <MerchantTabs />;
}

export function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Main" component={MainContent} />
      <RootStack.Screen 
        name="Terms" 
        component={TermsScreen} 
        options={{ presentation: 'modal', headerShown: false }} 
      />
      <RootStack.Screen 
        name="Privacy" 
        component={PrivacyScreen} 
        options={{ presentation: 'modal', headerShown: false }} 
      />
    </RootStack.Navigator>
  );
}

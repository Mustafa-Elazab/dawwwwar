import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { PROFILE_ROUTES, WALLET_ROUTES } from '../routes';
import type { ProfileStackParamList } from '../types';
import { 
  ProfileScreen, 
  EditProfileScreen,
  AddressesScreen, 
  AddAddressScreen, 
  LanguageScreen, 
  AppearanceScreen, 
  WalletScreen, 
  TransactionsScreen,
  PaymentMethodsScreen,
  AddPaymentMethodScreen,
  InviteFriendsScreen,
  TermsScreen,
  PrivacyScreen,
  NotificationsScreen
} from '../placeholders';

const Stack = createStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PROFILE_ROUTES.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={PROFILE_ROUTES.EDIT_PROFILE} component={EditProfileScreen} />
      <Stack.Screen name={PROFILE_ROUTES.ADDRESSES} component={AddressesScreen} />
      <Stack.Screen name={PROFILE_ROUTES.ADD_ADDRESS} component={AddAddressScreen} />
      <Stack.Screen name={PROFILE_ROUTES.LANGUAGE} component={LanguageScreen} />
      <Stack.Screen name={PROFILE_ROUTES.APPEARANCE} component={AppearanceScreen} />
      <Stack.Screen name={PROFILE_ROUTES.TERMS} component={TermsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.PRIVACY} component={PrivacyScreen} />
      <Stack.Screen name={WALLET_ROUTES.WALLET} component={WalletScreen} />
      <Stack.Screen name={WALLET_ROUTES.TRANSACTIONS} component={TransactionsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.PAYMENT_METHODS} component={PaymentMethodsScreen} />
      <Stack.Screen name={PROFILE_ROUTES.ADD_PAYMENT_METHOD} component={AddPaymentMethodScreen} />
      <Stack.Screen name={PROFILE_ROUTES.INVITE_FRIENDS} component={InviteFriendsScreen} />
    </Stack.Navigator>
  );
}

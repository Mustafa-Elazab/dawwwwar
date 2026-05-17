import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';

export type OtpScreenNavProp = StackNavigationProp<
  AuthStackParamList,
  typeof AUTH_ROUTES.OTP
>;
export type OtpScreenRouteProp = RouteProp<
  AuthStackParamList,
  typeof AUTH_ROUTES.OTP
>;

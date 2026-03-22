import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/route';
import { AUTH_ROUTES } from '../../navigation/route';

export type PhoneScreenNavProp = StackNavigationProp<
  AuthStackParamList,
  typeof AUTH_ROUTES.PHONE
>;

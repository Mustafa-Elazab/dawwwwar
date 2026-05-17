import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';

export type PhoneScreenNavProp = StackNavigationProp<
  AuthStackParamList,
  typeof AUTH_ROUTES.PHONE
>;

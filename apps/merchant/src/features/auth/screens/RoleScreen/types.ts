import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/route';
import { AUTH_ROUTES } from '../../navigation/route';

export type RoleScreenNavProp = StackNavigationProp<
  AuthStackParamList,
  typeof AUTH_ROUTES.ROLE
>;

export interface RoleOption {
  role: 'CUSTOMER' | 'MERCHANT' | 'DRIVER';
  icon: string;
  titleKey: string;
  subtitleKey: string;
}

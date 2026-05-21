import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../../navigation/types';
import { AUTH_ROUTES } from '../../../../navigation/routes';

export type PhoneScreenNavProp = StackNavigationProp<AuthStackParamList, typeof AUTH_ROUTES.PHONE>;

export type PhoneScreenRouteProp = RouteProp<AuthStackParamList, typeof AUTH_ROUTES.PHONE>;

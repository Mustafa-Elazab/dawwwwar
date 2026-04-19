import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../../../navigation/types';
import type { HOME_ROUTES } from '../../../navigation/routes';

export type SearchScreenNavProp = StackNavigationProp<
  HomeStackParamList,
  typeof HOME_ROUTES.SEARCH
>;
export type SearchScreenRouteProp = RouteProp<
  HomeStackParamList,
  typeof HOME_ROUTES.SEARCH
>;

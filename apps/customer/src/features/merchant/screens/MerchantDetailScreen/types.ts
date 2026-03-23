import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../../../../navigation/types';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { MerchantTab } from '../../components/TabBar';

export type MerchantDetailNavProp = StackNavigationProp<
  HomeStackParamList,
  typeof HOME_ROUTES.MERCHANT_DETAIL
>;
export type MerchantDetailRouteProp = RouteProp<
  HomeStackParamList,
  typeof HOME_ROUTES.MERCHANT_DETAIL
>;
export type { MerchantTab };

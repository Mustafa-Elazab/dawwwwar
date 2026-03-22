import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { CustomerTabParamList } from '../../../../navigation/types';
import type { HomeStackParamList } from '../../../../navigation/types';
import { HOME_ROUTES } from '../../../../navigation/routes';

export type HomeScreenNavProp = CompositeNavigationProp<
  StackNavigationProp<HomeStackParamList, typeof HOME_ROUTES.HOME>,
  BottomTabNavigationProp<CustomerTabParamList>
>;

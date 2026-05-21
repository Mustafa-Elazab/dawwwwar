import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectIsAuthenticated } from '../../../../store/slices/auth.slice';
import { useActiveOrders, usePastOrders } from '../../core/hooks';
import { AUTH_ROUTES, ORDER_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OrdersStackParamList, RootParamList } from '../../../../navigation/types';

export type OrderTab = 'active' | 'past';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList>>();
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const {
    data: activeOrders,
    isLoading: activeLoading,
    refetch: refetchActive,
  } = useActiveOrders();
  const { data: pastOrders, isLoading: pastLoading, refetch: refetchPast } = usePastOrders();

  const handleLogin = useCallback(() => {
    const rootNavigation = navigation.getParent<StackNavigationProp<RootParamList>>();
    rootNavigation?.navigate('Auth', { screen: AUTH_ROUTES.PHONE, params: {} });
  }, [navigation]);

  const handleTrack = useCallback(
    (orderId: string) => navigation.navigate(ORDER_ROUTES.TRACKING, { orderId }),
    [navigation],
  );
  const handleDetail = useCallback(
    (orderId: string) => navigation.navigate(ORDER_ROUTES.ORDER_DETAIL, { orderId }),
    [navigation],
  );

  const currentOrders = activeTab === 'active' ? (activeOrders ?? []) : (pastOrders ?? []);
  const isLoading = activeTab === 'active' ? activeLoading : pastLoading;
  const refetch = activeTab === 'active' ? refetchActive : refetchPast;

  return {
    activeTab,
    setActiveTab,
    orders: currentOrders,
    isLoading: isAuthenticated ? isLoading : false,
    handleTrack,
    handleDetail,
    refetch,
    isAuthenticated,
    handleLogin,
    t,
  };
}

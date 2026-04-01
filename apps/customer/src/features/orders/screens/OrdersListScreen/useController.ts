import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useActiveOrders, usePastOrders } from '../../core/hooks';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OrdersStackParamList } from '../../../../navigation/types';

export type OrderTab = 'active' | 'past';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList>>();
  const [activeTab, setActiveTab] = useState<OrderTab>('active');

  const { data: activeOrders, isLoading: activeLoading, refetch: refetchActive } = useActiveOrders();
  const { data: pastOrders, isLoading: pastLoading, refetch: refetchPast } = usePastOrders();

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
    activeTab, setActiveTab,
    orders: currentOrders,
    isLoading,
    handleTrack,
    handleDetail,
    refetch,
    t,
  };
}

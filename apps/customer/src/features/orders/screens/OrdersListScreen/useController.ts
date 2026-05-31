import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useMyOrders } from '../../core/hooks';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { OrdersStackParamList } from '../../../../navigation/types';

export type OrderTab = 'all' | 'active' | 'completed' | 'cancelled';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<OrdersStackParamList>>();
  const [activeTab, setActiveTab] = useState<OrderTab>('all');

  const { data: allOrders = [], isLoading, refetch } = useMyOrders();

  const handleDetail = useCallback(
    (orderId: string) => navigation.navigate(ORDER_ROUTES.ORDER_DETAIL, { orderId }),
    [navigation],
  );

  const currentOrders = allOrders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return !['COMPLETED', 'DELIVERED', 'CANCELLED', 'REJECTED'].includes(order.status);
    }
    if (activeTab === 'completed') return ['COMPLETED', 'DELIVERED'].includes(order.status);
    return ['CANCELLED', 'REJECTED'].includes(order.status);
  });

  return {
    activeTab,
    setActiveTab,
    tabs: ['all', 'active', 'completed', 'cancelled'] as const,
    labels: {
      title: t('orders.title'),
      emptyTitle: t('orders.empty_active'),
      emptySubtitle: t('orders.empty_active_sub'),
      tabs: {
        all: t('orders.tab_all'),
        active: t('orders.tab_active'),
        completed: t('orders.tab_completed'),
        cancelled: t('orders.tab_cancelled'),
      },
    },
    orders: currentOrders,
    isLoading,
    handleDetail,
    refetch,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { incrementNewOrders, clearNewOrders } from '../../../../store/slices/merchant.slice';
import { merchantOrdersApi } from '../../core/api';
import { mockMerchants } from '@dawwar/mocks';
import { useOrders, useAcceptOrder, useRejectOrder } from '../../core/hooks';
import { OrderStatus } from '@dawwar/types';
import type { Order } from '@dawwar/types';
import { preloadAlertSound, playAlertSound, stopAlertSound } from '../../../../utils/sound';

export type OrderTab = 'new' | 'preparing' | 'ready' | 'active' | 'completed';

const TAB_STATUSES: Record<OrderTab, OrderStatus[]> = {
  new: [OrderStatus.PENDING],
  preparing: [OrderStatus.ACCEPTED],
  ready: [OrderStatus.DRIVER_ASSIGNED],
  active: [OrderStatus.AT_SHOP, OrderStatus.SHOPPING, OrderStatus.PURCHASED, OrderStatus.IN_TRANSIT],
  completed: [OrderStatus.COMPLETED, OrderStatus.DELIVERED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
};

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OrderTab>('new');
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Find this user's merchant profile
  const merchant = mockMerchants.find((m) => m.userId === user?.id);

  const { data: orders, refetch } = useQuery({
    queryKey: ['merchant', 'orders', merchant?.id],
    queryFn: () => merchantOrdersApi.getOrders(merchant?.id ?? ''),
    enabled: !!merchant?.id,
    staleTime: 30_000,
    select: (res: { data: Order[] }) => res.data,
  });

  // Simulate new order arriving 8 seconds after mount (demo/test)
  useEffect(() => {
    const t = setTimeout(() => {
      if (orders && orders.length > 0) {
        const pending = orders.find((o) => o.status === OrderStatus.PENDING);
        if (pending) {
          setPendingOrder(pending);
          setShowModal(true);
          dispatch(incrementNewOrders());
          playAlertSound();
        }
      }
    }, 8000);
    return () => clearTimeout(t);
  }, [orders, dispatch]);

  // Preload sound on mount
  useEffect(() => {
    preloadAlertSound();
  }, []);

  const acceptMutation = useAcceptOrder({
    mutationFn: ({ orderId, prepMinutes }: { orderId: string; prepMinutes: number }) =>
      merchantOrdersApi.acceptOrder(orderId, prepMinutes),
    onSuccess: () => {
      setShowModal(false);
      setPendingOrder(null);
      dispatch(clearNewOrders());
      stopAlertSound();
      void queryClient.invalidateQueries({ queryKey: ['merchant', 'orders'] });
      Toast.show({ type: 'success', text1: t('merchant_app.accept') });
    },
    onError: () => Toast.show({ type: 'error', text1: t('errors.server') }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      merchantOrdersApi.rejectOrder(orderId, reason),
    onSuccess: () => {
      setShowModal(false);
      setPendingOrder(null);
      dispatch(clearNewOrders());
      stopAlertSound();
      void queryClient.invalidateQueries({ queryKey: ['merchant', 'orders'] });
    },
  });

  const markReadyMutation = useMutation({
    mutationFn: (orderId: string) => merchantOrdersApi.markReady(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['merchant', 'orders'] });
    },
  });

  const filteredOrders = (orders ?? []).filter((o) =>
    TAB_STATUSES[activeTab]?.includes(o.status),
  );

  const handleAccept = useCallback(
    (prepMinutes: number) => {
      if (!pendingOrder) return;
      acceptMutation.mutate({ orderId: pendingOrder.id, prepMinutes });
    },
    [pendingOrder, acceptMutation],
  );

  const handleReject = useCallback(() => {
    if (!pendingOrder) return;
    rejectMutation.mutate({ orderId: pendingOrder.id, reason: 'Too busy' });
  }, [pendingOrder, rejectMutation]);

  const handleMarkReady = useCallback(
    (orderId: string) => markReadyMutation.mutate(orderId),
    [markReadyMutation],
  );

  return {
    activeTab,
    setActiveTab,
    orders: filteredOrders,
    pendingOrder,
    showModal,
    isAccepting: acceptMutation.isPending,
    handleAccept,
    handleReject,
    handleMarkReady,
    refetch,
    t,
  };
}

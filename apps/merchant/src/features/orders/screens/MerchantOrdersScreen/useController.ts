import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { 
  useMerchantOrders, 
  useMerchantAcceptOrder, 
  useMerchantRejectOrder,
  useMerchantMarkReady,
  QUERY_KEYS,
  SOCKET_EVENTS,
  Rooms
} from '@dawwar/api-client';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { incrementNewOrders, clearNewOrders } from '../../../../store/slices/merchant.slice';
import { OrderStatus } from '@dawwar/types';
import type { Order } from '@dawwar/types';
import { preloadAlertSound, playAlertSound, stopAlertSound } from '../../../../utils/sound';
import { socketManager } from '../../../../core/socket';

export type OrderTab = 'new' | 'preparing' | 'ready' | 'active' | 'completed';

const TAB_STATUSES: Record<OrderTab, OrderStatus[]> = {
  new: [OrderStatus.PENDING],
  preparing: [OrderStatus.ACCEPTED, OrderStatus.DRIVER_ASSIGNED],
  ready: [OrderStatus.READY],
  active: [OrderStatus.AT_SHOP, OrderStatus.SHOPPING, OrderStatus.PURCHASED, OrderStatus.PICKED_UP, OrderStatus.IN_TRANSIT],
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

  const merchantId = user?.id;

  const { data: res, refetch } = useMerchantOrders();
  const orders = res?.data;

  // Real-time socket for new orders
  useEffect(() => {
    if (!merchantId) return;

    const socket = socketManager.connect();
    socketManager.joinRoom(Rooms.merchant(merchantId), { merchantId });

    const handleNewOrder = (order: Order) => {
      setPendingOrder(order);
      setShowModal(true);
      dispatch(incrementNewOrders());
      playAlertSound();
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    };

    const handleStatusChange = () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    };

    const handleReconnect = () => {
      console.log('[Socket] Merchant reconnected, refreshing orders');
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('merchant') });
    };

    socketManager.on(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);
    socketManager.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChange);
    socketManager.on('reconnect', handleReconnect);

    return () => {
      socketManager.leaveRoom(Rooms.merchant(merchantId), { merchantId });
      socketManager.off(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);
      socketManager.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChange);
      socketManager.off('reconnect', handleReconnect);
    };
  }, [merchantId, dispatch, queryClient]);

  // Preload sound on mount
  useEffect(() => {
    preloadAlertSound();
  }, []);

  const acceptMutation = useMerchantAcceptOrder();
  const rejectMutation = useMerchantRejectOrder();
  const markReadyMutation = useMerchantMarkReady();

  const handleAccept = useCallback(
    async (prepMinutes: number) => {
      if (!pendingOrder) return;
      try {
        await acceptMutation.mutateAsync({ 
          id: pendingOrder.id, 
          payload: { prepMinutes } 
        });
        setShowModal(false);
        setPendingOrder(null);
        dispatch(clearNewOrders());
        stopAlertSound();
        Toast.show({ type: 'success', text1: t('merchant_app.accept') });
      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [pendingOrder, acceptMutation, t, dispatch],
  );

  const handleReject = useCallback(async () => {
    if (!pendingOrder) return;
    try {
      await rejectMutation.mutateAsync({ 
        id: pendingOrder.id, 
        payload: { reason: 'Too busy' } 
      });
      setShowModal(false);
      setPendingOrder(null);
      dispatch(clearNewOrders());
      stopAlertSound();
    } catch {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [pendingOrder, rejectMutation, dispatch]);

  const handleMarkReady = useCallback(
    async (id: string) => {
      try {
        await markReadyMutation.mutateAsync(id);
        Toast.show({ type: 'success', text1: t('merchant_app.ready_success') });
      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [markReadyMutation, t],
  );

  const filteredOrders = (orders ?? []).filter((o) =>
    TAB_STATUSES[activeTab]?.includes(o.status),
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

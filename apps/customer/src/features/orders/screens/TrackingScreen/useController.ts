import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { ordersApi } from '../../core/api';
import { OrderStatus } from '@dawwar/types';
import type { RouteProp } from '@react-navigation/native';
import type { OrdersStackParamList } from '../../../../navigation/types';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { socketManager } from '../../../../core/socket';
import { SOCKET_EVENTS } from '@dawwar/api-client';

export function useController() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const route = useRoute<RouteProp<OrdersStackParamList, typeof ORDER_ROUTES.TRACKING>>();
  const { orderId } = route.params;

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getById(orderId),
    staleTime: 30_000,
    select: (res) => res.data,
  });

  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Real-time socket for order updates
  useEffect(() => {
    if (!orderId) return;

    // Connect and join order room
    socketManager.connect();
    socketManager.joinRoom(SOCKET_EVENTS.JOIN_ORDER_ROOM, { orderId });

    // Handler for status changes
    const handleStatusChange = (data: { orderId: string; status: string; order: any }) => {
      console.log('[Socket] Order status changed:', data.status);
      // Invalidate the query to fetch fresh data from REST
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      
      if (data.status === OrderStatus.COMPLETED) {
        Toast.show({ type: 'success', text1: t('tracking.delivered_success') });
      }
    };

    // Handler for driver location updates
    const handleDriverLocation = (data: { latitude: number; longitude: number; heading?: number }) => {
      setDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    };

    const handleReconnect = () => {
      console.log('[Socket] Reconnected, invalidating order query');
      void queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    };

    // Listen for events
    socketManager.on(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChange);
    socketManager.on(SOCKET_EVENTS.DRIVER_LOCATION, handleDriverLocation);
    socketManager.on('reconnect', handleReconnect);

    return () => {
      socketManager.leaveRoom(SOCKET_EVENTS.LEAVE_ORDER_ROOM, { orderId });
      socketManager.off(SOCKET_EVENTS.ORDER_STATUS_CHANGED, handleStatusChange);
      socketManager.off(SOCKET_EVENTS.DRIVER_LOCATION, handleDriverLocation);
      socketManager.off('reconnect', handleReconnect);
    };
  }, [orderId, queryClient, t]);

  const hasDriver = !!order?.driverId;
  const canCancel =
    order?.status === OrderStatus.PENDING || order?.status === OrderStatus.ACCEPTED;

  return {
    order,
    isLoading,
    isError,
    driverLocation: hasDriver ? driverLocation : null,
    hasDriver,
    canCancel,
    t,
  };
}

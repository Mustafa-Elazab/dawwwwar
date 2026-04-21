import { useState, useEffect, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { ordersApi } from '../../core/api';
import { OrderStatus } from '@dawwar/types';
import type { RouteProp } from '@react-navigation/native';
import type { OrdersStackParamList } from '../../../../navigation/types';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { socket } from '../../../../core/socket/socket';
import { USE_MOCK_API } from '../../../../core/api/config';

const MOCK_DRIVER_START = { latitude: 30.8704, longitude: 31.4741 };

export function useController() {
  const { t } = useTranslation();
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

  const [driverLocation, setDriverLocation] = useState(MOCK_DRIVER_START);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Phase 2: Real-time socket for order updates
  useEffect(() => {
    if (USE_MOCK_API) return; // Use mock movement for mock mode
    if (!orderId) return;

    // Connect and join order room
    socket.connect();
    socket.emit('join:order_room', { orderId });

    // Handler for status changes
    const handleStatusChange = (data: { orderId: string; status: string; order: unknown }) => {
      console.log('[Socket] Order status changed:', data);
    };

    // Handler for driver location updates
    const handleDriverLocation = (data: { latitude: number; longitude: number; heading?: number }) => {
      setDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    };

    // Listen for events
    socket.on('order:status_changed', handleStatusChange);
    socket.on('driver:location', handleDriverLocation);

    return () => {
      socket.emit('leave:order_room', { orderId });
      socket.off('order:status_changed', handleStatusChange);
      socket.off('driver:location', handleDriverLocation);
      socket.disconnect();
    };
  }, [orderId]);

  // Phase 1: Mock driver movement (only used when USE_MOCK_API is true)
  useEffect(() => {
    if (!USE_MOCK_API) return;
    if (!order?.driverId) return;
    intervalRef.current = setInterval(() => {
      setDriverLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0005,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0005,
      }));
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order?.driverId]);

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

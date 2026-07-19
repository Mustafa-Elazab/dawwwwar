import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  setOnline, setActiveOrder, setLocationPermission, updateLocation,
  selectIsOnline, selectActiveOrderId,
} from '../../../../store/slices/driver.slice';
import { availableOrdersApi } from '../../core/api';
import { SOCKET_EVENTS } from '@dawwar/api-client';
import { TAB_ROUTES, DRIVER_ROUTES } from '../../../../navigation/routes';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { DriverTabParamList } from '../../../../navigation/types';
import Toast from 'react-native-toast-message';
import { socketManager } from '../../../../core/socket';
import { USE_MOCK_API } from '../../../../core/api/config';
import { locationService } from '../../../../core/location/location.service';
import type { Order } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<DriverTabParamList>>();
  const dispatch = useAppDispatch();

  const isOnline = useAppSelector(selectIsOnline);
  const activeOrderId = useAppSelector(selectActiveOrderId);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Only fetch orders when online
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['driver', 'available-orders'],
    queryFn: availableOrdersApi.getAvailable,
    enabled: isOnline,
    refetchInterval: isOnline && USE_MOCK_API ? 15_000 : false,  // poll only in mock mode
    select: (res) => res.data,
  });

  // Phase 3: Real GPS + Socket for real-time updates
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (USE_MOCK_API) return;
    if (!isOnline) return;

    // Connect socket when going online
    socketManager.connect();

    // Listen for new orders
    const handleNewOrder = (order: Order) => {
      console.log('[Socket] New available order:', order.orderNumber);
      void queryClient.invalidateQueries({ queryKey: ['driver', 'available-orders'] });
      Toast.show({ type: 'info', text1: t('driver.new_order_alert'), text2: `#${order.orderNumber}` });
    };

    socketManager.on(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);

    // Start watching real GPS location (balanced accuracy when idle)
    locationService.startWatching(
      (loc) => {
        dispatch(updateLocation({ latitude: loc.latitude, longitude: loc.longitude }));
        // Update backend DB (for nearest-driver queries)
        void availableOrdersApi.updateLocation(loc.latitude, loc.longitude);
      },
      () => {},
      false, // balanced accuracy when idle (saves battery)
    );

    return () => {
      locationService.stopWatching();
      socketManager.off(SOCKET_EVENTS.ORDER_NEW, handleNewOrder);
    };
  }, [isOnline, dispatch, queryClient, t]);

  const acceptMutation = useMutation({
    mutationFn: availableOrdersApi.acceptOrder,
    onSuccess: (res, orderId) => {
      dispatch(setActiveOrder(orderId));
      // Navigate to Active Delivery tab
      navigation.navigate(TAB_ROUTES.ACTIVE_DELIVERY_TAB, {
        screen: DRIVER_ROUTES.ACTIVE_DELIVERY,
        params: { orderId },
      });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: t('driver.order_taken') });
    },
    onSettled: () => setAcceptingOrderId(null),
  });

  const declineMutation = useMutation({
    mutationFn: availableOrdersApi.declineOrder,
  });

  const handleToggleOnline = useCallback(async () => {
    if (!isOnline) {
      // Request location permission first
      const granted = await locationService.requestPermission();
      if (!granted) {
        Toast.show({ type: 'error', text1: t('driver.location_permission_required') });
        return;
      }
      dispatch(setLocationPermission(true));
      dispatch(setOnline(true));
    } else {
      locationService.stopWatching();
      dispatch(setOnline(false));
    }
  }, [isOnline, dispatch, t]);

  const handleAccept = useCallback(
    (orderId: string) => {
      setAcceptingOrderId(orderId);
      acceptMutation.mutate(orderId);
    },
    [acceptMutation],
  );

  const handleDecline = useCallback(
    (orderId: string) => {
      declineMutation.mutate(orderId);
    },
    [declineMutation],
  );

  return {
    isOnline,
    activeOrderId,
    orders: orders ?? [],
    isLoading,
    acceptingOrderId,
    handleToggleOnline,
    handleAccept,
    handleDecline,
    refetch,
    t,
  };
}

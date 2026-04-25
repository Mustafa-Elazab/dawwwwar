import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  setOnline, setActiveOrder, setLocationPermission,
  selectIsOnline, selectActiveOrderId,
} from '../../../../store/slices/driver.slice';
import { availableOrdersApi } from '../../core/api';
import { TAB_ROUTES, DRIVER_ROUTES } from '../../../../navigation/routes';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { DriverTabParamList } from '../../../../navigation/types';
import Toast from 'react-native-toast-message';
import { socket } from '../../../../core/socket/socket';
import { USE_MOCK_API } from '../../../../core/api/config';
import { locationService } from '../../../../core/location/location.service';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<BottomTabNavigationProp<DriverTabParamList>>();
  const dispatch = useAppDispatch();

  const isOnline = useAppSelector(selectIsOnline);
  const activeOrderId = useAppSelector(selectActiveOrderId);
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);

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
    socket.connect();

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
      socket.disconnect();
    };
  }, [isOnline, dispatch]);

  const acceptMutation = useMutation({
    mutationFn: availableOrdersApi.acceptOrder,
    onSuccess: (res, orderId) => {
      dispatch(setActiveOrder(orderId));
      // Navigate to Active Delivery tab
      navigation.navigate(TAB_ROUTES.ACTIVE_DELIVERY_TAB as never, {
        screen: DRIVER_ROUTES.ACTIVE_DELIVERY,
        params: { orderId },
      } as never);
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
        Toast.show({ type: 'error', text1: 'Location permission required to go online' });
        return;
      }
      dispatch(setLocationPermission(true));
      dispatch(setOnline(true));
    } else {
      locationService.stopWatching();
      dispatch(setOnline(false));
    }
  }, [isOnline, dispatch]);

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

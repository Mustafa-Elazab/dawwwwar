import { useState, useCallback } from 'react';
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
    refetchInterval: isOnline ? 15_000 : false,  // poll every 15s when online
    select: (res) => res.data,
  });

  const acceptMutation = useMutation({
    mutationFn: availableOrdersApi.acceptOrder,
    onSuccess: (res, orderId) => {
      dispatch(setActiveOrder(orderId));
      // Navigate to Active Delivery tab
      navigation.navigate(TAB_ROUTES.ACTIVE_DELIVERY_TAB as any, {
        screen: DRIVER_ROUTES.ACTIVE_DELIVERY,
        params: { orderId },
      } as any);
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
      // Request location permission first (Phase 1: skip real permission, just set flag)
      dispatch(setLocationPermission(true));
      dispatch(setOnline(true));
    } else {
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

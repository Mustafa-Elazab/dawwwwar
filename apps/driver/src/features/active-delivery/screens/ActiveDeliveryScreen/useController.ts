import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Linking } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../../../store/hooks';
import { setActiveOrder, updateLocation } from '../../../../store/slices/driver.slice';
import { useActiveOrder, useUpdateStatus, useSendPhotos } from '../../core/hooks';
import { OrderStatus, OrderType } from '@dawwar/types';
import { DRIVER_ROUTES } from '../../../navigation/routes';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ActiveDeliveryStackParamList } from '../../../../navigation/types';

// Sinbellawin starting position for mock driver location
const DRIVER_START = { latitude: 30.8704, longitude: 31.4741 };

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ActiveDeliveryStackParamList>>();
  const route = useRoute<RouteProp<ActiveDeliveryStackParamList, typeof DRIVER_ROUTES.ACTIVE_DELIVERY>>();
  const dispatch = useAppDispatch();
  const { orderId } = route.params;

  // Mock driver location — moves every 5 seconds
  const [driverLocation, setDriverLocation] = useState(DRIVER_START);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDriverLocation((prev) => {
        const next = {
          latitude: prev.latitude + (Math.random() - 0.5) * 0.0006,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.0006,
        };
        dispatch(updateLocation(next));
        return next;
      });
    }, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [dispatch]);

  const { data: order, isLoading: orderLoading } = useActiveOrder(orderId);
  const updateStatusMutation = useUpdateStatus(orderId);
  const sendPhotosMutation = useSendPhotos(orderId);

  const [photosSent, setPhotosSent] = useState(false);

  const handleStatusUpdate = useCallback(
    async (status: OrderStatus, extra?: { actualAmount?: number; receiptImage?: string }) => {
      try {
        await updateStatusMutation.mutateAsync({ status, extra });
      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [updateStatusMutation, t],
  );

  const handleArrived = useCallback(() => {
    if (!order) return;
    if (order.status === OrderStatus.DRIVER_ASSIGNED) {
      const nextStatus = order.type === OrderType.CUSTOM
        ? OrderStatus.AT_SHOP
        : ('AT_MERCHANT' as OrderStatus);
      void handleStatusUpdate(nextStatus);
    } else if (order.status === OrderStatus.IN_TRANSIT || order.status === OrderStatus.PURCHASED) {
      void handleStatusUpdate(OrderStatus.DELIVERED);
    }
  }, [order, handleStatusUpdate]);

  const handleConfirmPickup = useCallback(() => {
    void handleStatusUpdate(OrderStatus.IN_TRANSIT);
  }, [handleStatusUpdate]);

  const handleSendPhotos = useCallback(async () => {
    await sendPhotosMutation.mutateAsync([]);
    setPhotosSent(true);
    Toast.show({ type: 'success', text1: 'Photos sent to customer' });
  }, [sendPhotosMutation]);

  const handleShoppingConfirm = useCallback(
    (actualAmount: number, receiptUri: string) => {
      void handleStatusUpdate(OrderStatus.IN_TRANSIT, {
        actualAmount,
        receiptImage: receiptUri,
      });
    },
    [handleStatusUpdate],
  );

  const handleConfirmDelivery = useCallback(() => {
    void handleStatusUpdate(OrderStatus.COMPLETED).then(() => {
      dispatch(setActiveOrder(null));
      navigation.replace(DRIVER_ROUTES.COMPLETED_DELIVERY, {
        orderId,
        netEarnings: (order?.deliveryFee ?? 12) - 5,
      });
    });
  }, [handleStatusUpdate, dispatch, navigation, orderId, order]);

  const handleNavigate = useCallback(() => {
    if (!order) return;
    const dest = order.status === OrderStatus.IN_TRANSIT || order.status === OrderStatus.PURCHASED
      ? `${order.deliveryLatitude},${order.deliveryLongitude}`
      : `${order.shopLatitude ?? order.merchant?.latitude},${order.shopLongitude ?? order.merchant?.longitude}`;
    void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
  }, [order]);

  const handleCallContact = useCallback(() => {
    const phone = order?.deliveryPhone ?? '';
    void Linking.openURL(`tel:${phone}`);
  }, [order]);

  const isLoading = updateStatusMutation.isPending || orderLoading;

  return {
    order,
    isLoading,
    driverLocation,
    photosSent,
    handleArrived,
    handleConfirmPickup,
    handleSendPhotos,
    handleShoppingConfirm,
    handleConfirmDelivery,
    handleNavigate,
    handleCallContact,
    t,
  };
}

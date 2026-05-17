import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Linking } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { 
  useOrderDetails, 
  useUpdateDeliveryStatus, 
  SOCKET_EVENTS,
  useUploadFile,
} from '@dawwar/api-client';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { setActiveOrder, updateLocation, selectActiveOrderId } from '../../../../store/slices/driver.slice';
import { OrderStatus, OrderType } from '@dawwar/types';
import { DRIVER_ROUTES } from '../../../../navigation/routes';
import { locationService } from '../../../../core/location/location.service';
import { socketManager } from '../../../../core/socket';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ActiveDeliveryStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ActiveDeliveryStackParamList>>();
  const route = useRoute<RouteProp<ActiveDeliveryStackParamList, typeof DRIVER_ROUTES.ACTIVE_DELIVERY>>();
  const dispatch = useAppDispatch();
  const { orderId } = route.params;
  const activeOrderId = useAppSelector(selectActiveOrderId);

  // Real GPS driver location
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    // 0. Join order room
    socketManager.joinRoom(SOCKET_EVENTS.JOIN_ORDER_ROOM, { orderId: activeOrderId || orderId });

    locationService.startWatching(
      (loc) => {
        const next = { latitude: loc.latitude, longitude: loc.longitude };
        setDriverLocation(next);
        dispatch(updateLocation(next));

        // 1. Check socket connectivity
        const isConnected = socketManager.instance?.connected;

        if (isConnected && activeOrderId) {
          // 2. If connected, send current location
          socketManager.emit(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, {
            latitude: loc.latitude,
            longitude: loc.longitude,
            heading: loc.heading ?? undefined,
            orderId: activeOrderId,
          });
        } else {
          // 3. If offline, buffer the update
          locationService.bufferLocation(loc);
        }
      },
      (err) => console.warn('GPS error:', err.message),
      true,
    );

    // 4. On socket reconnect, flush and replay buffered locations
    const handleReconnect = () => {
      if (activeOrderId) {
        const buffered = locationService.flushBuffer();
        if (buffered.length > 0) {
          console.log(`[Socket] Replaying ${buffered.length} buffered locations...`);
          buffered.forEach((loc) => {
            socketManager.emit(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, {
              latitude: loc.latitude,
              longitude: loc.longitude,
              heading: loc.heading ?? undefined,
              orderId: activeOrderId,
              timestamp: loc.timestamp, // include original timestamp
            });
          });
        }
      }
    };

    socketManager.on('reconnect', handleReconnect);

    return () => {
      locationService.stopWatching();
      socketManager.off('reconnect', handleReconnect);
    };
  }, [activeOrderId, dispatch, orderId]);

  const { data: res, isLoading: orderLoading } = useOrderDetails(orderId);
  const order = res?.data;

  const updateStatusMutation = useUpdateDeliveryStatus();
  const uploadFile = useUploadFile();

  const handleStatusUpdate = useCallback(
    async (status: OrderStatus, extra?: { actualAmount?: number; receiptImage?: string }) => {
      try {
        await updateStatusMutation.mutateAsync({ 
          id: orderId, 
          payload: { status, ...extra } 
        });
      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [updateStatusMutation, orderId, t],
  );

  const handleArrived = useCallback(() => {
    if (!order) return;
    if (order.status === OrderStatus.DRIVER_ASSIGNED || order.status === OrderStatus.READY) {
      const nextStatus = order.type === OrderType.CUSTOM
        ? OrderStatus.AT_SHOP
        : OrderStatus.PICKED_UP; // For regular orders, arrived at merchant
      void handleStatusUpdate(nextStatus);
    } else if (order.status === OrderStatus.IN_TRANSIT || order.status === OrderStatus.PURCHASED) {
      void handleStatusUpdate(OrderStatus.DELIVERED);
    }
  }, [order, handleStatusUpdate]);

  const handleConfirmPickup = useCallback(() => {
    void handleStatusUpdate(OrderStatus.IN_TRANSIT);
  }, [handleStatusUpdate]);

  // Shopping Flow State
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [photosSent, setPhotosSent] = useState(false);

  const handlePhotosCapture = useCallback((uris: string[]) => {
    setCapturedPhotos(uris);
  }, []);

  const handleSendPhotos = useCallback(async () => {
    if (capturedPhotos.length === 0) return;
    
    try {
      // 1. Upload photos
      const urls = await Promise.all(capturedPhotos.map(async (uri, i) => {
        const formData = new FormData();
        formData.append('file', { uri, name: `shop_photo_${i}.jpg`, type: 'image/jpeg' } as any);
        formData.append('folder', 'orders');
        const res = await uploadFile.mutateAsync(formData);
        return res.data.url;
      }));

      // 2. Send to Chat (Customer can see them)
      for (const url of urls) {
         socketManager.emit('CHAT_SEND_MESSAGE', {
           orderId,
           type: 'IMAGE',
           mediaUrl: url,
           clientMessageId: `img_${Math.random().toString(36).substring(7)}`,
         });
      }

      setPhotosSent(true);
      Toast.show({ type: 'success', text1: t('driver.photos_sent') });
    } catch {
      Toast.show({ type: 'error', text1: t('errors.server') });
    }
  }, [capturedPhotos, orderId, uploadFile, t]);

  const handleShoppingConfirm = useCallback(
    async (actualAmount: number, receiptUri: string) => {
      try {
        // 1. Upload receipt
        const formData = new FormData();
        formData.append('file', { uri: receiptUri, name: 'receipt.jpg', type: 'image/jpeg' } as any);
        formData.append('folder', 'receipts');
        const uploadRes = await uploadFile.mutateAsync(formData);
        
        // 2. Update status to PURCHASED
        await handleStatusUpdate(OrderStatus.PURCHASED, {
          actualAmount,
          receiptImage: uploadRes.data.url,
        });

        // 3. Send receipt to chat as well
        socketManager.emit('CHAT_SEND_MESSAGE', {
          orderId,
          type: 'IMAGE',
          content: 'Receipt uploaded',
          mediaUrl: uploadRes.data.url,
          clientMessageId: `rcpt_${Math.random().toString(36).substring(7)}`,
        });

      } catch {
        Toast.show({ type: 'error', text1: t('errors.server') });
      }
    },
    [handleStatusUpdate, orderId, uploadFile, t],
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

  const isLoading = updateStatusMutation.isPending || orderLoading || uploadFile.isPending;

  return {
    order,
    isLoading,
    driverLocation,
    handleArrived,
    handleConfirmPickup,
    handleShoppingConfirm,
    handleConfirmDelivery,
    handleNavigate,
    handleCallContact,
    handleSendPhotos,
    handlePhotosCapture,
    photosSent,
    t,
  };
}

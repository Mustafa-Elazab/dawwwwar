import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartMerchantId,
  clearCart,
} from '../../../../store/slices/cart.slice';
import { selectUser } from '../../../../store/slices/auth.slice';
import { selectLocation } from '../../../../store/slices/location.slice';
import { 
  usePlaceOrder, 
  useAddresses, 
  QUERY_KEYS 
} from '@dawwar/api-client';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { PaymentMethod } from '@dawwar/types';
import api from '../../../../core/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  getPaymentMethodLabelKey,
  writeSelectedPaymentMethod,
} from '../../../profile/core/paymentMethods';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootParamList } from '../../../../navigation/types';

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const merchantId = useAppSelector(selectCartMerchantId);
  const user = useAppSelector(selectUser);
  const location = useAppSelector(selectLocation);

  // Real Data Hooks
  const { data: addressesRes } = useAddresses(user?.id);
  
  const addresses = addressesRes ? unwrap<any[]>(addressesRes) : [];

  // Match global selected location, or fallback to default
  const selectedAddress = useMemo(() => {
    if (location.selectedAddressId) {
      const match = addresses.find(a => a.id === location.selectedAddressId);
      if (match) return match;
    }
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }, [addresses, location.selectedAddressId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [notes, setNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      setPaymentMethod(PaymentMethod.CASH);
      writeSelectedPaymentMethod('cash');
    }, []),
  );

  // Fetch delivery fee dynamically
  const { data: feeRes } = useQuery({
    queryKey: ['deliveryFee', merchantId, selectedAddress?.latitude, selectedAddress?.longitude, location.latitude, location.longitude, subtotal],
    queryFn: async () => {
      const lat = selectedAddress?.latitude ?? location.latitude;
      const lng = selectedAddress?.longitude ?? location.longitude;
      if (!lat || !lng || !merchantId) return null;
      const { data } = await api.get('/orders/delivery-fee', {
        params: { merchantId, latitude: lat, longitude: lng, subtotal },
      });
      return data;
    },
    enabled: !!merchantId && (!!selectedAddress || !!location.latitude),
  });

  const deliveryFee = feeRes?.fee ?? 0;
  const total = subtotal + deliveryFee;

  const placeOrderMutation = usePlaceOrder();

  const handleSetPaymentMethod = useCallback((_method: PaymentMethod) => {
    setPaymentMethod(PaymentMethod.CASH);
    writeSelectedPaymentMethod('cash');
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    // Determine delivery coordinates safely
    const deliveryLat = selectedAddress ? Number(selectedAddress.latitude) : location.latitude;
    const deliveryLng = selectedAddress ? Number(selectedAddress.longitude) : location.longitude;
    const deliveryAddr = selectedAddress ? selectedAddress.address : location.currentAddress;

    if (!deliveryLat || !deliveryLng || !deliveryAddr) return;

    try {
      const res = await placeOrderMutation.mutateAsync({
        merchantId: merchantId ?? '',
        paymentMethod: PaymentMethod.CASH,
        deliveryAddress: deliveryAddr,
        deliveryLatitude: deliveryLat,
        deliveryLongitude: deliveryLng,
        deliveryPhone: selectedAddress?.phone ?? user?.phone ?? '',
        deliveryFee,
        deliveryNotes: notes,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.nameAr || i.name,
          productNameAr: i.nameAr,
          quantity: i.quantity,
          price: Number(i.price),
          selectedModifiers: i.selectedModifiers,
        })),
      });

      dispatch(clearCart());
      // Invalidate orders list
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('all') });
      const order = unwrap<any>(res);
      navigation.navigate('CustomerTabs', {
        screen: 'OrdersTab',
        params: { 
          screen: 'TrackingScreen',
          params: { orderId: order.id }
        }
      });
    } catch {
      // Error handled by mutation or global interceptor
    }
  }, [selectedAddress, location, user, merchantId, subtotal, deliveryFee, notes, items, placeOrderMutation, dispatch, queryClient, navigation]);

  const isButtonDisabled =
    items.length === 0 || (!selectedAddress && !location.latitude) || placeOrderMutation.isPending;

  return {
    items,
    subtotal,
    deliveryFee,
    distanceKm: feeRes?.distanceKm,
    isFree: feeRes?.isFree,
    total,
    paymentMethod,
    setPaymentMethod: handleSetPaymentMethod,
    selectedPaymentLabel: t(getPaymentMethodLabelKey('cash')),
    notes,
    setNotes,
    walletBalance: 0,
    isWalletInsufficient: false,
    address: selectedAddress || { label: 'map', address: location.currentAddress || t('checkout.add_address_hint') },
    isLoading: placeOrderMutation.isPending,
    isError: placeOrderMutation.isError,
    isButtonDisabled,
    handlePlaceOrder,
    handleBack: () => navigation.goBack(),
    t,
  };
}

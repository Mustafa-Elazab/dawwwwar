import { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartMerchantId,
  clearCart,
} from '../../../../store/slices/cart.slice';
import { selectUser, selectIsAuthenticated } from '../../../../store/slices/auth.slice';
import { selectLocation } from '../../../../store/slices/location.slice';
import { usePlaceOrder, useAddresses, useWallet, QUERY_KEYS } from '@dawwar/api-client';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { PaymentMethod } from '@dawwar/types';
import api from '../../../../core/api/client';
import { useQuery } from '@tanstack/react-query';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const merchantId = useAppSelector(selectCartMerchantId);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useAppSelector(selectLocation);

  const [showLoginGate, setShowLoginGate] = useState(false);

  // Real Data Hooks
  const { data: addressesRes } = useAddresses(isAuthenticated ? user?.id : undefined);
  const { data: walletRes } = useWallet();

  const addresses = addressesRes?.data || [];
  const wallet = walletRes?.data;
  const walletBalance = Number(wallet?.balance || 0);

  // Match global selected location, or fallback to default
  const selectedAddress = useMemo(() => {
    if (!isAuthenticated) return null;
    if (location.selectedAddressId) {
      const match = addresses.find(a => a.id === location.selectedAddressId);
      if (match) return match;
    }
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }, [isAuthenticated, addresses, location.selectedAddressId]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [notes, setNotes] = useState('');

  // Fetch delivery fee dynamically
  const { data: feeRes } = useQuery({
    queryKey: [
      'deliveryFee',
      merchantId,
      selectedAddress?.latitude,
      selectedAddress?.longitude,
      location.latitude,
      location.longitude,
      subtotal,
    ],
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
  const isWalletInsufficient =
    isAuthenticated && paymentMethod === PaymentMethod.WALLET && walletBalance < total;

  const placeOrderMutation = usePlaceOrder();

  const handlePlaceOrder = useCallback(async () => {
    if (!isAuthenticated) {
      setShowLoginGate(true);
      return;
    }

    // Determine delivery coordinates safely
    const deliveryLat = selectedAddress ? Number(selectedAddress.latitude) : location.latitude;
    const deliveryLng = selectedAddress ? Number(selectedAddress.longitude) : location.longitude;
    const deliveryAddr = selectedAddress ? selectedAddress.address : location.currentAddress;

    if (!deliveryLat || !deliveryLng || !deliveryAddr) return;

    try {
      const res = await placeOrderMutation.mutateAsync({
        merchantId: merchantId ?? '',
        paymentMethod,
        deliveryAddress: deliveryAddr,
        deliveryLatitude: deliveryLat,
        deliveryLongitude: deliveryLng,
        deliveryPhone: selectedAddress?.phone ?? user?.phone ?? '',
        deliveryFee,
        deliveryNotes: notes,
        items: items.map(i => ({
          productId: i.productId,
          productName: i.nameAr || i.name,
          quantity: i.quantity,
          price: Number(i.price),
        })),
      });

      dispatch(clearCart());
      // Invalidate orders list
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.list('all') });
      navigation.navigate('CustomerTabs', {
        screen: 'OrdersTab',
        params: {
          screen: 'TrackingScreen',
          params: { orderId: res.data.id },
        },
      });
    } catch {
      // Error handled by mutation or global interceptor
    }
  }, [
    isAuthenticated,
    selectedAddress,
    location,
    user,
    merchantId,
    paymentMethod,
    subtotal,
    deliveryFee,
    notes,
    items,
    placeOrderMutation,
    dispatch,
    queryClient,
    navigation,
  ]);

  const isButtonDisabled =
    items.length === 0 ||
    (!selectedAddress && !location.latitude) ||
    isWalletInsufficient ||
    placeOrderMutation.isPending;

  return {
    items,
    subtotal,
    deliveryFee,
    distanceKm: feeRes?.distanceKm,
    isFree: feeRes?.isFree,
    total,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    walletBalance,
    isWalletInsufficient,
    address: selectedAddress || {
      label: 'map',
      address: location.currentAddress || t('checkout.add_address_hint'),
    },
    isLoading: placeOrderMutation.isPending,
    isError: placeOrderMutation.isError,
    isButtonDisabled,
    handlePlaceOrder,
    handleBack: () => navigation.goBack(),
    showLoginGate,
    setShowLoginGate,
    t,
  };
}

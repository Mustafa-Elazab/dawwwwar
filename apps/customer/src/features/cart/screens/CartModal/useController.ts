import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAddresses } from '@dawwar/api-client';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  selectCartMerchantId,
  removeItem,
  updateQuantity,
  clearCart,
} from '../../../../store/slices/cart.slice';
import { selectUser } from '../../../../store/slices/auth.slice';
import { selectLocation } from '../../../../store/slices/location.slice';
import { MODAL_ROUTES, TAB_ROUTES } from '../../../../navigation/routes';
import api from '../../../../core/api/client';

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const merchantId = useAppSelector(selectCartMerchantId);
  const user = useAppSelector(selectUser);
  const location = useAppSelector(selectLocation);
  const { data: addressesRes } = useAddresses(user?.id);
  const addresses = addressesRes ? unwrap<any[]>(addressesRes) : [];
  const selectedAddress = location.selectedAddressId
    ? addresses.find((address) => address.id === location.selectedAddressId)
    : addresses.find((address) => address.isDefault) || addresses[0];

  const deliveryLat = selectedAddress?.latitude ?? location.latitude;
  const deliveryLng = selectedAddress?.longitude ?? location.longitude;

  const { data: feeRes, isFetching: isFeeLoading } = useQuery({
    queryKey: ['cartDeliveryFee', merchantId, deliveryLat, deliveryLng, subtotal],
    queryFn: async () => {
      if (!merchantId || deliveryLat == null || deliveryLng == null) return null;
      const { data } = await api.get('/orders/delivery-fee', {
        params: {
          merchantId,
          latitude: Number(deliveryLat),
          longitude: Number(deliveryLng),
          subtotal,
        },
      });
      return unwrap<{ fee: number; distanceKm: number; isFree: boolean }>(data);
    },
    enabled: !!merchantId && deliveryLat != null && deliveryLng != null && subtotal > 0,
    staleTime: 30_000,
  });

  const deliveryFee = Number(feeRes?.fee ?? 0);
  const total = subtotal + deliveryFee;

  const handleAdd = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      if (!item) return;
      dispatch(updateQuantity({ productId, quantity: item.quantity + 1 }));
    },
    [items, dispatch],
  );

  const handleRemove = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      if (!item) return;
      if (item.quantity <= 1) {
        dispatch(removeItem(productId));
      } else {
        dispatch(updateQuantity({ productId, quantity: item.quantity - 1 }));
      }
    },
    [items, dispatch],
  );

  const handleClearCart = useCallback(() => {
    Alert.alert(t('cart.clear_cart_title'), t('cart.clear_cart_body'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('cart.clear_and_add'),
        onPress: () => dispatch(clearCart()),
        style: 'destructive',
      },
    ]);
  }, [dispatch, t]);

  const handleCheckout = useCallback(() => {
    navigation.navigate(MODAL_ROUTES.CHECKOUT);
  }, [navigation]);

  const handleClose = useCallback(() => {
    navigation.navigate(TAB_ROUTES.HOME_TAB);
  }, [navigation]);

  return {
    items,
    subtotal,
    deliveryFee,
    distanceKm: feeRes?.distanceKm,
    isFeeLoading,
    total,
    count,
    merchantId,
    isEmpty: count === 0,
    handleAdd,
    handleRemove,
    handleClearCart,
    handleCheckout,
    handleClose,
    t,
  };
}

import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  selectCartMerchantId,
  clearCart,
} from '../../../../store/slices/cart.slice';
import { selectUser } from '../../../../store/slices/auth.slice';
import { ordersApi } from '../../../orders/core/api';
import { ORDER_ROUTES } from '../../../../navigation/routes';
import { PaymentMethod } from '@dawwar/types';

const DELIVERY_FEE = 12;
const MOCK_ADDRESS = {
  id: 'addr-1',
  label: 'Home',
  address: 'شارع الجمهورية، سنبلاوين',
  latitude: 30.872,
  longitude: 31.476,
  phone: '01011111111',
};
const WALLET_BALANCE = 200;

export function useController() {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const merchantId = useAppSelector(selectCartMerchantId);
  const user = useAppSelector(selectUser);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [notes, setNotes] = useState('');

  const total = subtotal + DELIVERY_FEE;
  const isWalletInsufficient =
    paymentMethod === PaymentMethod.WALLET && WALLET_BALANCE < total;

  const placeOrderMutation = useMutation({
    mutationFn: () =>
      ordersApi.placeOrder({
        customerId: user?.id ?? '',
        merchantId: merchantId ?? undefined,
        paymentMethod,
        deliveryAddress: MOCK_ADDRESS.address,
        deliveryLatitude: MOCK_ADDRESS.latitude,
        deliveryLongitude: MOCK_ADDRESS.longitude,
        deliveryPhone: MOCK_ADDRESS.phone,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.nameAr,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    onSuccess: (res) => {
      dispatch(clearCart());
      navigation.navigate(ORDER_ROUTES.TRACKING, { orderId: res.data.id });
    },
  });

  const isButtonDisabled =
    items.length === 0 || isWalletInsufficient || placeOrderMutation.isPending;

  return {
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total,
    paymentMethod,
    setPaymentMethod: useCallback(setPaymentMethod, []),
    notes,
    setNotes: useCallback(setNotes, []),
    walletBalance: WALLET_BALANCE,
    isWalletInsufficient,
    address: MOCK_ADDRESS,
    isLoading: placeOrderMutation.isPending,
    isError: placeOrderMutation.isError,
    isButtonDisabled,
    handlePlaceOrder: () => placeOrderMutation.mutate(),
    handleBack: () => navigation.goBack(),
    t,
  };
}

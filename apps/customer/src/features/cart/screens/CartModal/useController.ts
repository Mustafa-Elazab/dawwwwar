import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
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
import { MODAL_ROUTES } from '../../../../navigation/routes';

const DELIVERY_FEE = 12;

export function useController() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectCartCount);
  const merchantId = useAppSelector(selectCartMerchantId);

  const total = subtotal + DELIVERY_FEE;

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
    navigation.goBack();
  }, [navigation]);

  return {
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
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

import { useState, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  addItem,
  removeItem,
  updateQuantity,
  selectCartItems,
  selectCartMerchantId,
  selectCartTotal,
  selectCartCount,
} from '../../../../store/slices/cart.slice';
import { useMerchantDetail, useMerchantProducts } from '../../core/hooks';
import { MODAL_ROUTES } from '../../../../navigation/routes';
import type { MerchantDetailNavProp, MerchantDetailRouteProp, MerchantTab } from './types';
import type { Product } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<MerchantDetailNavProp>();
  const route = useRoute<MerchantDetailRouteProp>();
  const dispatch = useAppDispatch();

  const { merchantId } = route.params;
  const [activeTab, setActiveTab] = useState<MerchantTab>('menu');

  const {
    data: merchant,
    isLoading: merchantLoading,
    isError,
    refetch,
  } = useMerchantDetail(merchantId);
  const { data: products, isLoading: productsLoading } = useMerchantProducts(merchantId);

  const cartItems = useAppSelector(selectCartItems);
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);

  const getProductQuantity = useCallback(
    (productId: string) => {
      return cartItems.find((i) => i.productId === productId)?.quantity ?? 0;
    },
    [cartItems],
  );

  const handleAddProduct = useCallback(
    (product: Product) => {
      if (!merchant) return;
      dispatch(
        addItem({
          productId: product.id,
          name: product.name,
          nameAr: product.nameAr,
          price: product.price,
          quantity: 1,
          image: product.images[0] ?? '',
          merchantId: merchant.id,
          merchantName: merchant.businessName,
        }),
      );
    },
    [dispatch, merchant],
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      const current = cartItems.find((i) => i.productId === productId);
      if (!current) return;
      if (current.quantity <= 1) {
        dispatch(removeItem(productId));
      } else {
        dispatch(updateQuantity({ productId, quantity: current.quantity - 1 }));
      }
    },
    [dispatch, cartItems],
  );

  const handleCartBarPress = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation.navigate(MODAL_ROUTES.CART as any);
  }, [navigation]);

  const isLoading = merchantLoading || productsLoading;
  // Show cart bar only if the cart belongs to THIS merchant
  const showCartBar = cartCount > 0 && cartMerchantId === merchantId;

  return {
    merchant,
    products: products ?? [],
    isLoading,
    isError,
    activeTab,
    setActiveTab,
    getProductQuantity,
    handleAddProduct,
    handleRemoveProduct,
    handleCartBarPress,
    handleBack: () => navigation.goBack(),
    showCartBar,
    cartCount,
    cartTotal,
    retry: refetch,
    t,
  };
}

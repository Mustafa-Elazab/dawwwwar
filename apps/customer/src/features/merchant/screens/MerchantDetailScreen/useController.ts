import { useState, useCallback, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../../categories/core/api';
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
    refetch: refetchMerchant,
  } = useMerchantDetail(merchantId);
  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useMerchantProducts(merchantId);

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60_000,
  });

  const cartItems = useAppSelector(selectCartItems);
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  const cartTotal = useAppSelector(selectCartTotal);
  const cartCount = useAppSelector(selectCartCount);

  // Group products by category
  const groupedProducts = useMemo(() => {
    if (!products) return [];
    const categories = categoriesRes?.data || [];
    const groups: Record<string, { categoryId: string; categoryName: string; products: Product[] }> = {};

    products.forEach((product) => {
      const cat = categories.find((c) => c.id === product.categoryId);
      const categoryName = cat ? cat.nameAr : t('categories.title');
      if (!groups[product.categoryId]) {
        groups[product.categoryId] = { categoryId: product.categoryId, categoryName, products: [] };
      }
      groups[product.categoryId].products.push(product);
    });

    return Object.values(groups);
  }, [products, categoriesRes, t]);

  const getProductQuantity = useCallback(
    (productId: string) => {
      return cartItems.find((i) => i.productId === productId)?.quantity ?? 0;
    },
    [cartItems],
  );

  const handleAddProduct = useCallback(
    (product: Product) => {
      if (!merchant) return;

      const doAdd = () => {
        dispatch(
          addItem({
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            quantity: 1,
            image: product.images[0] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
            merchantId: merchant.id,
            merchantName: merchant.businessName,
            merchantNameAr: merchant.businessName,
          }),
        );
      };

      if (cartMerchantId && cartMerchantId !== merchant.id) {
        import('react-native').then(({ Alert }) => {
          Alert.alert(
            t('cart.conflict_title', 'Replace Cart?'),
            t('cart.conflict_body', 'Your cart contains items from another store. Do you want to clear it and add this item?'),
            [
              { text: t('common.cancel', 'Cancel'), style: 'cancel' },
              {
                text: t('cart.clear_and_add', 'Clear & Add'),
                style: 'destructive',
                onPress: doAdd,
              },
            ],
          );
        });
        return;
      }

      doAdd();
    },
    [dispatch, merchant, cartMerchantId, t],
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
    navigation.navigate(MODAL_ROUTES.CART as any);
  }, [navigation]);

  const isLoading = merchantLoading || productsLoading;
  // Show cart bar only if the cart belongs to THIS merchant
  const showCartBar = cartCount > 0 && cartMerchantId === merchantId;

  return {
    merchant,
    groupedProducts,
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
    retry: () => { refetchMerchant(); refetchProducts(); },
    t,
  };
}

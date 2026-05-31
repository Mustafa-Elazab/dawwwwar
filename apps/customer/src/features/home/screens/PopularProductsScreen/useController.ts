import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import { addItem, clearCart, selectCartMerchantId } from '../../../../store/slices/cart.slice';
import { selectIsAuthenticated, startAuthFlow } from '../../../../store/slices/auth.slice';
import { useFeaturedProducts } from '../../core/hooks';
import { useLikedProducts, useToggleFavorite } from '../../../liked/core/hooks';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';
import type { Product } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const location = useAppSelector(selectLocation);
  const dispatch = useAppDispatch();
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: liked = [] } = useLikedProducts();
  const toggleFavorite = useToggleFavorite();
  const likedProductIds = useMemo(() => new Set(liked.map((item) => item.productId)), [liked]);
  
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useFeaturedProducts(location.latitude ?? undefined, location.longitude ?? undefined);

  const handleProductAdd = useCallback(
    (product: Product) => {
      const doAdd = () => {
        dispatch(
          addItem({
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            quantity: 1,
            image: product.images[0] ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
            merchantId: product.merchantId,
            merchantName: 'Dawwar Merchant', // UI Fallback
            merchantNameAr: 'Dawwar Merchant',
          }),
        );
      };

      if (cartMerchantId && cartMerchantId !== product.merchantId) {
        import('react-native').then(({ Alert }) => {
          Alert.alert(
            t('cart.conflict_title', 'Replace Cart?'),
            t('cart.conflict_body', 'Your cart contains items from another store. Do you want to clear it and add this item?'),
            [
              { text: t('common.cancel', 'Cancel'), style: 'cancel' },
              {
                text: t('cart.clear_and_add', 'Clear & Add'),
                style: 'destructive',
                onPress: () => {
                  dispatch(clearCart());
                  doAdd();
                },
              },
            ],
          );
        });
        return;
      }

      doAdd();
    },
    [dispatch, cartMerchantId, t],
  );

  const handleToggleFavorite = useCallback(
    (productId: string) => {
      if (!isAuthenticated) {
        dispatch(startAuthFlow());
        return;
      }
      toggleFavorite.mutate({ productId, liked: likedProductIds.has(productId) });
    },
    [dispatch, isAuthenticated, likedProductIds, toggleFavorite],
  );

  return {
    products: products ?? [],
    isLoading,
    isError,
    handleProductAdd,
    handleToggleFavorite,
    isProductLiked: (productId: string) => likedProductIds.has(productId),
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

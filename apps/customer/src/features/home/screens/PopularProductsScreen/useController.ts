import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
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
      navigation.navigate(HOME_ROUTES.PRODUCT_DETAIL, { productId: product.id });
    },
    [navigation],
  );

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate(HOME_ROUTES.PRODUCT_DETAIL, { productId });
    },
    [navigation],
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
    handleProductPress,
    handleToggleFavorite,
    isProductLiked: (productId: string) => likedProductIds.has(productId),
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addItem } from '../../../../store/slices/cart.slice';
import { selectUser } from '../../../../store/slices/auth.slice';
import { useNearbyMerchants, useFeaturedProducts } from '../../core/hooks';
import { mockMerchants } from '@dawwar/mocks';
import { HOME_ROUTES, MODAL_ROUTES } from '../../../../navigation/routes';
import type { HomeScreenNavProp } from './types';
import type { Product } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<HomeScreenNavProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const {
    data: merchants,
    isLoading: merchantsLoading,
    refetch,
  } = useNearbyMerchants();
  const { data: products } = useFeaturedProducts();

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  const handleProductAdd = useCallback(
    (product: Product) => {
      const merchant = mockMerchants.find((m) => m.id === product.merchantId);
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
    [dispatch],
  );

  const handleCustomOrder = useCallback(() => {
    // Navigate to the modal — cast to any because MODAL_ROUTES is in RootParamList
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigation.navigate(MODAL_ROUTES.CUSTOM_ORDER as any);
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate(HOME_ROUTES.SEARCH, {});
  }, [navigation]);

  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      navigation.navigate(HOME_ROUTES.CATEGORY_MERCHANTS, {
        categoryId,
        categoryName: categoryId,
      });
    },
    [navigation],
  );

  return {
    user,
    merchants: merchants ?? [],
    products: products ?? [],
    isLoading: merchantsLoading,
    refetch,
    handleMerchantPress,
    handleProductAdd,
    handleCustomOrder,
    handleSearchPress,
    handleCategoryPress,
    t,
  };
}

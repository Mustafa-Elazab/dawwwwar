import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addItem, clearCart, selectCartMerchantId } from '../../../store/slices/cart.slice';
import { selectUser } from '../../../store/slices/auth.slice';
import { selectLocation } from '../../../store/slices/location.slice';
import {
  useFeaturedProducts,
  useHomeCategories,
  useNearbyMerchants,
} from '../core/hooks';
import { useHomeDeliveryLocation } from '../../location/hooks/useHomeDeliveryLocation';
import { HOME_ROUTES, MODAL_ROUTES, PROFILE_ROUTES } from '../../../navigation/routes';
import type { HomeScreenNavProp } from '../screens/HomeScreen/types';
import type { Category, Product } from '@dawwar/types';

export interface HomeOffer {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export function useHomeController() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<HomeScreenNavProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const location = useAppSelector(selectLocation);
  const cartMerchantId = useAppSelector(selectCartMerchantId);
  const delivery = useHomeDeliveryLocation();
  const [sheetGpsBusy, setSheetGpsBusy] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const nearbyQuery = useNearbyMerchants(delivery.merchantLat, delivery.merchantLng);
  const productsQuery = useFeaturedProducts(delivery.merchantLat, delivery.merchantLng);
  const categoriesQuery = useHomeCategories(delivery.merchantLat, delivery.merchantLng);

  const categories = categoriesQuery.data ?? [];
  const merchants = nearbyQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const offers = useMemo<HomeOffer[]>(
    () =>
      (productsQuery.data ?? []).slice(0, 5).map((product: Product) => ({
        id: product.id,
        title: localizedProductName(product, i18n.language),
        subtitle: `${product.price} ${t('common.egp')}`,
        imageUrl: product.images[0] ?? '',
      })),
    [i18n.language, productsQuery.data, t],
  );

  const categoryDisplayName = useCallback(
    (category: Category) => (i18n.language.startsWith('ar') ? category.nameAr || category.name : category.name || category.nameAr),
    [i18n.language],
  );

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  const handleProductAdd = useCallback(
    (product: Product) => {
      const addProduct = () => {
        dispatch(
          addItem({
            productId: product.id,
            name: product.name,
            nameAr: product.nameAr,
            price: product.price,
            quantity: 1,
            image: product.images[0] ?? '',
            merchantId: product.merchantId,
            merchantName: t('merchant.fallbackName'),
          }),
        );
      };

      if (cartMerchantId && cartMerchantId !== product.merchantId) {
        Alert.alert(
          t('cart.conflict_title'),
          t('cart.conflict_body'),
          [
            { text: t('common.cancel'), style: 'cancel' },
            {
              text: t('cart.clear_and_add'),
              style: 'destructive',
              onPress: () => {
                dispatch(clearCart());
                addProduct();
              },
            },
          ],
        );
        return;
      }

      addProduct();
    },
    [cartMerchantId, dispatch, t],
  );

  const handleCustomOrder = useCallback(() => {
    navigation.navigate(MODAL_ROUTES.CUSTOM_ORDER as never);
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate(HOME_ROUTES.SEARCH, {});
  }, [navigation]);

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(HOME_ROUTES.CATEGORY_MERCHANTS, {
        categoryId,
        categoryName,
      });
    },
    [navigation],
  );

  const handleNotificationsPress = useCallback(() => {
    navigation.navigate(PROFILE_ROUTES.NOTIFICATIONS);
  }, [navigation]);

  const handleSeeAllCategories = useCallback(() => {
    navigation.navigate(HOME_ROUTES.NEARBY_MERCHANTS);
  }, [navigation]);

  const handleSeeAllNearby = useCallback(() => {
    navigation.navigate(HOME_ROUTES.NEARBY_MERCHANTS);
  }, [navigation]);

  const handleSeeAllPopular = useCallback(() => {
    navigation.navigate(HOME_ROUTES.POPULAR_PRODUCTS);
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        nearbyQuery.refetch(),
        categoriesQuery.refetch(),
        productsQuery.refetch(),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [categoriesQuery, nearbyQuery, productsQuery]);

  const openLocationPicker = useCallback(() => {
    navigation.navigate(HOME_ROUTES.LOCATION_PICKER);
  }, [navigation]);

  const runSheetCurrentLocation = useCallback(async () => {
    setSheetGpsBusy(true);
    try {
      await delivery.deliverCurrentLocationAsync();
    } finally {
      setSheetGpsBusy(false);
    }
  }, [delivery]);

  return {
    t,
    user,
    location,
    delivery,
    categories,
    merchants,
    offers,
    products,
    headerLocationText: delivery.headerLocationText,
    isLocationLoading: delivery.isLocationLoading || location.isLoading,
    isRefreshing,
    isLoading: nearbyQuery.isLoading || categoriesQuery.isLoading || productsQuery.isLoading,
    isError: nearbyQuery.isError || categoriesQuery.isError || productsQuery.isError,
    categoriesLoading: categoriesQuery.isLoading,
    merchantsLoading: nearbyQuery.isLoading,
    productsLoading: productsQuery.isLoading,
    offersLoading: productsQuery.isLoading,
    categoryDisplayName,
    handleRefresh,
    handleMerchantPress,
    handleProductAdd,
    handleCustomOrder,
    handleSearchPress,
    handleCategoryPress,
    handleNotificationsPress,
    handleSeeAllCategories,
    handleSeeAllNearby,
    handleSeeAllPopular,
    openLocationPicker,
    selectSavedAddress: delivery.selectSavedAddress,
    runSheetCurrentLocation,
    sheetGpsBusy,
  };
}

function localizedProductName(product: Product, language: string) {
  return language.startsWith('ar') ? product.nameAr || product.name : product.name || product.nameAr;
}

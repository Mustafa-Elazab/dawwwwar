import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectIsAuthenticated, selectUser, startAuthFlow } from '../../../../store/slices/auth.slice';
import { selectLocation } from '../../../../store/slices/location.slice';
import { useNearbyMerchants, useFeaturedProducts, useHomeCategories } from '../../core/hooks';
import { useHomeDeliveryLocation } from '../../../location/hooks/useHomeDeliveryLocation';
import { HOME_ROUTES, MODAL_ROUTES, PROFILE_ROUTES } from '../../../../navigation/routes';
import type { HomeScreenNavProp } from './types';
import type { Category, Product } from '@dawwar/types';
import { useLikedProducts, useToggleFavorite } from '../../../liked/core/hooks';
import { requestPushNotificationPermission } from '../../../../utils/notifications';
import { setPushNotifications } from '../../../../store/slices/ui.slice';
import { storage, StorageKeys } from '../../../../core/storage/mmkv';

export function useController() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<HomeScreenNavProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useAppSelector(selectLocation);

  const delivery = useHomeDeliveryLocation();
  const {
    data: merchants,
    isLoading: merchantsLoading,
    isError: merchantsError,
    refetch: refetchMerchants,
  } = useNearbyMerchants(
    delivery.merchantLat,
    delivery.merchantLng,
  );
  const { data: products, isError: productsError } = useFeaturedProducts(delivery.merchantLat, delivery.merchantLng);
  const { data: liked = [] } = useLikedProducts();
  const toggleFavorite = useToggleFavorite();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
  } = useHomeCategories(delivery.merchantLat, delivery.merchantLng);

  const [sheetGpsBusy, setSheetGpsBusy] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (storage.getBoolean(StorageKeys.PUSH_NOTIFICATION_PROMPTED)) return;
    storage.set(StorageKeys.PUSH_NOTIFICATION_PROMPTED, true);
    void requestPushNotificationPermission().then((granted) => {
      dispatch(setPushNotifications(granted));
    });
  }, [dispatch, isAuthenticated]);

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

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

  const handleCustomOrder = useCallback(() => {
    navigation.navigate(MODAL_ROUTES.CUSTOM_ORDER as never);
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate(HOME_ROUTES.SEARCH, {});
  }, [navigation]);

  const categoryDisplayName = useCallback(
    (c: Category) => (i18n.language.startsWith('ar') ? c.nameAr || c.name : c.name || c.nameAr),
    [i18n.language],
  );

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(HOME_ROUTES.CATEGORY_MERCHANTS, {
        categoryId,
        categoryName,
      });
    },
    [navigation],
  );

  const handleSeeAllCategories = useCallback(() => {
    navigation.navigate(HOME_ROUTES.CATEGORIES);
  }, [navigation]);

  const handleNotificationsPress = useCallback(() => {
    navigation.navigate(PROFILE_ROUTES.NOTIFICATIONS);
  }, [navigation]);

  const likedProductIds = useMemo(() => new Set(liked.map((item) => item.productId)), [liked]);

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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchMerchants(), refetchCategories()]);
    setIsRefreshing(false);
  }, [refetchMerchants, refetchCategories]);

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
    user,
    location,
    delivery,
    categories,
    categoriesLoading,
    categoryDisplayName,
    headerLocationText: delivery.headerLocationText,
    isLocationLoading: delivery.isLocationLoading || location.isLoading,
    navigate: navigation.navigate as (name: string, params?: object) => void,
    merchants: merchants ?? [],
    products: products ?? [],
    isLoading: merchantsLoading,
    screenState: {
      isError: merchantsError || productsError || categoriesError,
      isEmpty: !merchantsLoading && (merchants ?? []).length === 0 && (products ?? []).length === 0,
      emptyState: {
        icon: 'store-search-outline',
        title: t('home.empty_title', 'No nearby stores'),
        subtitle: t('home.empty_subtitle', 'Try another delivery location.'),
      },
    },
    isRefreshing,
    handleRefresh,
    handleMerchantPress,
    handleProductAdd,
    handleProductPress,
    handleCustomOrder,
    handleSearchPress,
    handleCategoryPress,
    handleSeeAllCategories,
    handleNotificationsPress,
    handleToggleFavorite,
    isProductLiked: (productId: string) => likedProductIds.has(productId),
    openLocationPicker,
    selectSavedAddress: delivery.selectSavedAddress,
    runSheetCurrentLocation,
    sheetGpsBusy,
    t,
  };
}

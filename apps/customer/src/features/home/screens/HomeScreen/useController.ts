import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addItem, clearCart } from '../../../../store/slices/cart.slice';
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
    refetch: refetchMerchants,
  } = useNearbyMerchants(
    delivery.merchantLat,
    delivery.merchantLng,
  );
  const { data: products } = useFeaturedProducts(delivery.merchantLat, delivery.merchantLng);
  const { data: liked = [] } = useLikedProducts();
  const toggleFavorite = useToggleFavorite();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
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

  const cartMerchantId = useAppSelector((state: any) => state.cart.merchantId);

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
    isRefreshing,
    handleRefresh,
    handleMerchantPress,
    handleProductAdd,
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

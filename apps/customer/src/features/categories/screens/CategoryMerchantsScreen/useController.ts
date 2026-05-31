import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import { categoriesApi } from '../../core/api';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, typeof HOME_ROUTES.CATEGORY_MERCHANTS>>();
  const location = useAppSelector(selectLocation);
  
  // Strict parameter safety
  const params = route.params || {};
  const categoryId = params.categoryId || '';
  const categoryName = params.categoryName || t('categories.title');

  const {
    data: merchants,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['merchants', 'category', categoryId, location.latitude, location.longitude],
    queryFn: () => categoriesApi.getMerchantsByCategory(categoryId, location.latitude ?? undefined, location.longitude ?? undefined),
    staleTime: 60_000,
    select: (res) => res,
    enabled: !!categoryId, // Prevent query if no ID
  });

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  return {
    categoryName,
    merchants: merchants ?? [],
    isLoading,
    isError,
    labels: {
      open: t('merchant.open'),
      closed: t('merchant.closed'),
      minutes: t('common.min'),
      emptyTitle: t('categories.no_results'),
      emptySubtitle: t('categories.no_results_sub'),
    },
    handleMerchantPress,
    handleBack: () => navigation.goBack(),
    refetch,
  };
}

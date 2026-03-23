import { useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { categoriesApi } from '../../core/api';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const route = useRoute<RouteProp<HomeStackParamList, typeof HOME_ROUTES.CATEGORY_MERCHANTS>>();
  const { categoryId, categoryName } = route.params;

  const {
    data: merchants,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['merchants', 'category', categoryId],
    queryFn: () => categoriesApi.getMerchantsByCategory(categoryId),
    staleTime: 60_000,
    select: (res) => res.data,
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
    handleMerchantPress,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

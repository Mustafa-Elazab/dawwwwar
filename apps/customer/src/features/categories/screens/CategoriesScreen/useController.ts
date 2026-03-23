import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { categoriesApi } from '../../core/api';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60_000,
    select: (res) => res.data,
  });

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(HOME_ROUTES.CATEGORY_MERCHANTS, { categoryId, categoryName });
    },
    [navigation],
  );

  return {
    categories: categories ?? [],
    isLoading,
    isError,
    handleCategoryPress,
    refetch,
    t,
  };
}

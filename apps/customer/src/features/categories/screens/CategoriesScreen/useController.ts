import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../core/api';
import { HOME_ROUTES, TAB_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';
import type { Category } from '@dawwar/types';

export function useController() {
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
    select: (res) =>
      [...res.data]
        .filter((c: Category) => c.isActive)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  });

  const handleCategoryPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate(TAB_ROUTES.HOME_TAB as any, {
        screen: HOME_ROUTES.CATEGORY_MERCHANTS,
        params: {
          categoryId,
          categoryName,
        },
      });
    },
    [navigation],
  );

  return {
    categories: categories ?? [],
    isLoading,
    isError,
    handleCategoryPress,
    refetch,
  };
}

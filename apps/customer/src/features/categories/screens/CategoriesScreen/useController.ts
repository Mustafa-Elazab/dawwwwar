import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { categoriesApi } from '../../core/api';
import { HOME_ROUTES } from '../../../../navigation/routes';
import { useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';
import type { Category } from '@dawwar/types';

export function useController() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const location = useAppSelector(selectLocation);

  const {
    data: categories,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['categories', location.latitude, location.longitude],
    queryFn: () => categoriesApi.getAll(location.latitude ?? undefined, location.longitude ?? undefined),
    staleTime: 10 * 60_000,
    select: (res) =>
      [...res]
        .filter((c: Category) => c.isActive)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  });

  const paddedCategories = useMemo(() => {
    const data = [...(categories ?? [])];
    while (data.length % 3 !== 0) {
      data.push({
        id: `__empty_${data.length}`,
        name: '',
        nameAr: '',
        icon: '',
        sortOrder: 0,
        isActive: true,
      } as Category);
    }
    return data;
  }, [categories]);

  const getDisplayName = useCallback(
    (category: Category) => i18n.language.startsWith('ar')
      ? category.nameAr || category.name
      : category.name || category.nameAr,
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

  return {
    categories: paddedCategories,
    isLoading,
    isError,
    headerTitle: t('categories.title'),
    emptyTitle: t('categories.no_results'),
    getDisplayName,
    handleCategoryPress,
    handleBack: () => navigation.goBack(),
    refetch,
  };
}

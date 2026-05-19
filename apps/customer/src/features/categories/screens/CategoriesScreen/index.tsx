import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ListScreenTemplate, Text, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { CategoryCard } from '../../components/CategoryCard';
import { useController } from './useController';
import type { Category } from '@dawwar/types';

export function CategoriesScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  const categories = ctrl.categories ?? [];
  const paddedData = [...categories];
  console.log('CategoriesScreen - categories:', categories);
  while (paddedData.length % 3 !== 0) {
    paddedData.push({
      id: `__empty_${paddedData.length}`,
      name: '',
      nameAr: '',
      icon: '',
      sortOrder: 0,
      isActive: true,
    } as Category);
  }

  const renderItem = React.useCallback(
    ({ item }: { item: Category }) => {
      if (item.id.startsWith('__empty_')) {
        return <View style={{ flex: 1, margin: 6 }} />;
      }
      const displayName = i18n.language.startsWith('ar')
        ? item.nameAr || item.name
        : item.name || item.nameAr;
      return (
        <CategoryCard
          category={item}
          onPress={() => ctrl.handleCategoryPress(item.id, displayName)}
        />
      );
    },
    [ctrl.handleCategoryPress, i18n.language],
  );

  return (
      <ListScreenTemplate<Category>
      headerProps={{ 
        title: t('categories.title'),
        type: 'none'
      }}
      data={paddedData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={t('categories.no_results')}
    />
  );
}

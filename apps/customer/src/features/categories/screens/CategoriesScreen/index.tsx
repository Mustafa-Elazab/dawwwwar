import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ListScreenTemplate, Header, ErrorState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { CategoryCard } from '../../components/CategoryCard';
import { useController } from './useController';
import type { Category } from '@dawwar/types';

export function CategoriesScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <ListScreenTemplate<Category>
      edges={['top']}
      header={<Header title={ctrl.t('categories.title')} />}
      data={ctrl.categories}
      renderItem={({ item }) => (
        <CategoryCard
          category={item}
          onPress={() => ctrl.handleCategoryPress(item.id, item.nameAr)}
        />
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={ctrl.t('categories.no_results')}
    />
  );
}

import React from 'react';
import { ListScreenTemplate } from '@dawwar/ui';
import { CategoryGridItem } from './components/CategoryGridItem';
import { useController } from './useController';
import type { Category } from '@dawwar/types';

export function CategoriesScreen() {
  const ctrl = useController();

  const renderItem = React.useCallback(
    ({ item }: { item: Category }) => (
      <CategoryGridItem
        category={item}
        displayName={ctrl.getDisplayName(item)}
        onPress={ctrl.handleCategoryPress}
      />
    ),
    [ctrl.getDisplayName, ctrl.handleCategoryPress],
  );

  return (
    <ListScreenTemplate<Category>
      edges={['top']}
      headerProps={{ 
        title: ctrl.headerTitle,
        onBackPress: ctrl.handleBack,
      }}
      data={ctrl.categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={3}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={ctrl.emptyTitle}
    />
  );
}

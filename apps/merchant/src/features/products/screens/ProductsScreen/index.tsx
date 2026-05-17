import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ListScreenTemplate, Header, SearchBar, Icon } from '@dawwar/ui';
import { useTheme, space, shadows } from '@dawwar/theme';
import { ProductListItem } from '../../components/ProductListItem';
import { useController } from './useController';
import type { Product } from '@dawwar/types';

export function ProductsScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = React.useCallback(({ item }: { item: Product }) => (
    <ProductListItem
      product={item}
      onEdit={() => ctrl.handleEdit(item.id)}
      onDelete={() => ctrl.handleDelete(item.id)}
      onToggle={(val) => ctrl.handleToggle(item.id, val)}
      isTogglingId={ctrl.togglingId}
    />
  ), [ctrl.handleEdit, ctrl.handleDelete, ctrl.handleToggle, ctrl.togglingId]);

  return (
    <>
      <ListScreenTemplate<Product>
        edges={['top']}
        header={
          <>
            <Header title={ctrl.t('merchant.menu.title')} />
            <View style={{ padding: 8 }}>
              <SearchBar
                value={ctrl.search}
                onChangeText={ctrl.setSearch}
                onClear={() => ctrl.setSearch('')}
                placeholder={ctrl.t('merchant_app.products_search')}
              />
            </View>
          </>
        }
        data={ctrl.products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        isLoading={ctrl.isLoading}
        isError={ctrl.isError}
        onRetry={ctrl.refetch}
        onRefresh={ctrl.refetch}
        refreshing={false}
        emptyIcon="tag-off-outline"
        emptyTitle={ctrl.t('merchant.menu.empty')}
      />
      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={ctrl.handleAddNew} activeOpacity={0.85}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: space.xl,
    right: space.xl,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1A73E8', // Explicit primary color for FAB
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
    elevation: 8,
  },
});

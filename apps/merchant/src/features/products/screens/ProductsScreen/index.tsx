import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListScreenTemplate, Header, SearchBar, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { ProductListItem } from '../../components/ProductListItem';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Product } from '@dawwar/types';

export function ProductsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <>
      <ListScreenTemplate<Product>
        edges={['top']}
        header={
          <>
            <Header title={ctrl.t('merchant_app.products_title')} />
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
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onEdit={() => ctrl.handleEdit(item.id)}
            onDelete={() => ctrl.handleDelete(item.id)}
            onToggle={(val) => ctrl.handleToggle(item.id, val)}
            isTogglingId={ctrl.togglingId}
          />
        )}
        keyExtractor={(item) => item.id}
        isLoading={ctrl.isLoading}
        isError={ctrl.isError}
        onRetry={ctrl.refetch}
        onRefresh={ctrl.refetch}
        refreshing={false}
        emptyIcon="tag-off-outline"
        emptyTitle={ctrl.t('merchant.no_products')}
      />
      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={ctrl.handleAddNew} activeOpacity={0.85}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

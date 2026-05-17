import React, { useCallback } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ListScreenTemplate } from '@dawwar/ui';
import { useTheme, space } from '@dawwar/theme';
import { useController } from './useController';
import type { Product } from '@dawwar/types';
import { ProductCard } from '../../components/ProductCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - space.base * 2 - space.md) / 2;

export function PopularProductsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.gridItem}>
        <ProductCard
          product={item}
          onAdd={() => ctrl.handleProductAdd(item)}
          style={{ width: CARD_WIDTH }}
        />
      </View>
    ),
    [ctrl.handleProductAdd]
  );

  return (
    <ListScreenTemplate<Product>
      edges={['top']}
      headerProps={{
        title: t('home.popular_title'),
        onBackPress: ctrl.handleBack,
      }}
      data={ctrl.products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      isLoading={ctrl.isLoading}
      isError={ctrl.isError}
      onRetry={ctrl.refetch}
      onRefresh={ctrl.refetch}
      refreshing={false}
      emptyTitle={t('home.no_products')}
      emptySubtitle={t('home.no_products_sub')}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  columnWrapper: {
    gap: space.md,
    marginBottom: space.md,
  },
  gridItem: {
    width: CARD_WIDTH,
  },
});

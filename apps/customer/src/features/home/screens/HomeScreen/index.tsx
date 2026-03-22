import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { ScrollScreenTemplate, Text, Icon, Skeleton } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { BannerSlider } from '../../components/BannerSlider';
import { QuickActions } from '../../components/QuickActions';
import { MerchantCard } from '../../components/MerchantCard';
import { ProductCard } from '../../components/ProductCard';
import { SectionHeader } from '../../components/SectionHeader';
import { FAB } from '../../components/FAB';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Merchant, Product } from '@dawwar/types';

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <>
      <ScrollScreenTemplate
        edges={['top']}
        onRefresh={ctrl.refetch}
        refreshing={false}
      >
        {/* ── Header ───────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {ctrl.t('home.greeting')} {ctrl.user?.name ?? ''}
            </Text>
            <View style={styles.locationRow}>
              <Icon name="map-marker-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.locationText}>{ctrl.t('home.location')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Icon name="bell-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* ── Search bar (tap → SearchScreen, not editable here) ── */}
        <View style={styles.searchWrapper}>
          <TouchableOpacity
            style={styles.searchTap}
            onPress={ctrl.handleSearchPress}
            activeOpacity={0.9}
          >
            <Icon name="magnify" size={20} color={colors.placeholder} />
            <Text style={styles.searchPlaceholder}>
              {ctrl.t('home.search_placeholder')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Banners ──────────────────────────────── */}
        <BannerSlider />

        {/* ── Quick Actions ────────────────────────── */}
        <QuickActions
          onCustomOrder={ctrl.handleCustomOrder}
          onCategory={ctrl.handleCategoryPress}
        />

        {/* ── Nearby Merchants ─────────────────────── */}
        <SectionHeader title={ctrl.t('home.nearby_title')} />
        {ctrl.isLoading ? (
          <View style={styles.skeletonRow}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} width={180} height={170} />
            ))}
          </View>
        ) : (
          <FlatList<Merchant>
            data={ctrl.merchants}
            renderItem={({ item }) => (
              <MerchantCard
                merchant={item}
                onPress={() => ctrl.handleMerchantPress(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.merchantsList}
          />
        )}

        {/* ── Featured Products ────────────────────── */}
        <SectionHeader title={ctrl.t('home.popular_title')} />
        {ctrl.isLoading ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skeletonGridItem}>
                <Skeleton width="100%" height={210} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {ctrl.products.map((product: Product) => (
              <View key={product.id} style={styles.productGridItem}>
                <ProductCard
                  product={product}
                  onAdd={() => ctrl.handleProductAdd(product)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollScreenTemplate>

      {/* FAB — rendered outside ScrollScreenTemplate so it stays fixed */}
      <FAB onPress={ctrl.handleCustomOrder} />
    </>
  );
}

import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScreenTemplate, Text, Icon, SearchBar, Badge } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Merchant, Product, Category } from '@dawwar/types';

// ── Sub-components (inline — small enough) ────────────────────────────

function CategoryChip({
  category,
  onPress,
  styles,
}: {
  category: Category;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <TouchableOpacity style={styles.categoryChip} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.categoryEmoji}>{category.icon}</Text>
      <Text style={styles.categoryLabel}>{category.nameAr}</Text>
    </TouchableOpacity>
  );
}

function MerchantResult({
  merchant,
  onPress,
  styles,
  t,
}: {
  merchant: Merchant;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  t: (key: string) => string;
}) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.merchantRow} onPress={onPress} activeOpacity={0.8}>
      <FastImage
        source={{ uri: merchant.logo }}
        style={styles.merchantLogo}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.merchantInfo}>
        <Text style={styles.merchantName}>{merchant.businessName}</Text>
        <Text style={styles.merchantMeta}>
          ★ {merchant.rating.toFixed(1)} · {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
        </Text>
      </View>
      <Badge
        label={merchant.isOpen ? t('merchant.open') : t('merchant.closed')}
        variant={merchant.isOpen ? 'success' : 'error'}
        size="sm"
      />
    </TouchableOpacity>
  );
}

function ProductResult({
  product,
  onAdd,
  styles,
  t,
}: {
  product: Product;
  onAdd: () => void;
  styles: ReturnType<typeof createStyles>;
  t: (key: string) => string;
}) {
  return (
    <View style={styles.productRow}>
      <FastImage
        source={{ uri: product.images[0] }}
        style={styles.productImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.nameAr}</Text>
        <Text style={styles.productPrice}>{product.price} {t('common.egp')}</Text>
      </View>
      {product.isAvailable && (
        <TouchableOpacity style={styles.addBtn} onPress={onAdd} activeOpacity={0.85}>
          <Icon name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────

export function SearchScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate edges={['top', 'bottom']}>
      {/* Search input row — auto-focused on mount */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.backBtn} onPress={ctrl.handleBack}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={ctrl.query}
            onChangeText={ctrl.setQuery}
            onClear={() => ctrl.setQuery('')}
            placeholder={ctrl.t('home.search_placeholder')}
            autoFocus
          />
        </View>
      </View>

      {/* Loading indicator */}
      {ctrl.isLoading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}

      {/* Empty state */}
      {ctrl.isEmpty && !ctrl.isLoading && (
        <View style={styles.emptyContainer}>
          <Icon name="magnify-close" size={48} color={colors.textDisabled} />
          <Text style={styles.emptyText}>
            {ctrl.t('categories.no_results')}
          </Text>
          <Text style={styles.emptySubText}>
            "{ctrl.query}"
          </Text>
        </View>
      )}

      {/* Results */}
      {ctrl.hasResults && !ctrl.isLoading && (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Categories */}
          {ctrl.results!.categories.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>{ctrl.t('categories.title')}</Text>
              <View style={styles.categoryRow}>
                {ctrl.results!.categories.map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    category={cat}
                    onPress={() => ctrl.handleCategoryPress(cat.id, cat.nameAr)}
                    styles={styles}
                  />
                ))}
              </View>
            </>
          )}

          {/* Merchants */}
          {ctrl.results!.merchants.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>{ctrl.t('home.nearby_title')}</Text>
              {ctrl.results!.merchants.map((m) => (
                <MerchantResult
                  key={m.id}
                  merchant={m}
                  onPress={() => ctrl.handleMerchantPress(m.id)}
                  styles={styles}
                  t={ctrl.t}
                />
              ))}
            </>
          )}

          {/* Products */}
          {ctrl.results!.products.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>{ctrl.t('home.popular_title')}</Text>
              {ctrl.results!.products.map((p) => (
                <ProductResult
                  key={p.id}
                  product={p}
                  onAdd={() => ctrl.handleProductAdd(p)}
                  styles={styles}
                  t={ctrl.t}
                />
              ))}
            </>
          )}

        </ScrollView>
      )}

      {/* Initial state — nothing typed yet */}
      {!ctrl.query.trim() && !ctrl.isLoading && (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={56} color={colors.textDisabled} />
          <Text style={styles.emptySubText}>{ctrl.t('home.search_placeholder')}</Text>
        </View>
      )}
    </ScreenTemplate>
  );
}

import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  I18nManager,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Icon, Badge } from '@dawwar/ui';
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
          ★ {Number(merchant.rating || 0).toFixed(1)} · {merchant.deliveryTimeMin}–{merchant.deliveryTimeMax} {t('common.min')}
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
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const inputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }, [])
  );

  return (
    <ScreenTemplate 
      headerProps={{
        onBackPress: ctrl.handleBack,
      }}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={t('home.search_placeholder')}
            placeholderTextColor={colors.textSecondary}
            textAlign={I18nManager.isRTL ? 'right' : 'left'}
            returnKeyType="search"
            onChangeText={ctrl.setQuery}
            value={ctrl.query}
            inputAccessoryViewID={undefined}
          />
          {ctrl.query.length > 0 && (
            <TouchableOpacity onPress={() => ctrl.setQuery('')}>
              <Icon name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
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
            {t('categories.no_results')}
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
              <Text style={styles.sectionHeader}>{t('categories.title')}</Text>
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
              <Text style={styles.sectionHeader}>{t('home.nearby_title')}</Text>
              {ctrl.results!.merchants.map((m) => (
                <MerchantResult
                  key={m.id}
                  merchant={m}
                  onPress={() => ctrl.handleMerchantPress(m.id)}
                  styles={styles}
                  t={t}
                />
              ))}
            </>
          )}

          {/* Products */}
          {ctrl.results!.products.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>{t('home.popular_title')}</Text>
              {ctrl.results!.products.map((p) => (
                <ProductResult
                  key={p.id}
                  product={p}
                  onAdd={() => ctrl.handleProductAdd(p)}
                  styles={styles}
                  t={t}
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
          <Text style={styles.emptySubText}>{t('home.search_placeholder')}</Text>
        </View>
      )}
    </ScreenTemplate>
  );
}

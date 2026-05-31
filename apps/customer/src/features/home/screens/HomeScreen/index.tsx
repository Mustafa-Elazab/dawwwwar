import React, { useRef, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Icon, Skeleton } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import BottomSheet from '@gorhom/bottom-sheet';
import { BannerSlider } from '../../components/BannerSlider';
import { MerchantCard } from '../../components/MerchantCard';
import { ProductCard } from '../../../home/components/ProductCard';
import { SectionHeader } from '../../components/SectionHeader';
import { HomeScreenHeader } from './components/HomeScreenHeader';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Merchant, Product, Category } from '@dawwar/types';
import { LocationBottomSheet } from '../../../location/components/LocationBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PASTEL = ['#FFF3E0', '#FCE4EC', '#E3F2FD', '#E8F5E9', '#F3E5F5', '#FFFDE7', '#E0F2F1'];

function isMaterialStyleIcon(icon: string) {
  return /^[a-z0-9-]+$/.test(icon.trim()) && icon.trim().length >= 2;
}

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openLocationModal = () => {
    bottomSheetRef.current?.expand();
  };

  const closeLocationModal = () => {
    bottomSheetRef.current?.close();
  };

  const renderHeader = () => (
    <HomeScreenHeader
      colors={colors}
      deliverToLabel={t('home.deliver_to')}
      locationText={ctrl.isLocationLoading ? t('home.location_loading') : ctrl.headerLocationText}
      onLocationPress={openLocationModal}
      onNotificationsPress={ctrl.handleNotificationsPress}
    />
  );

  const renderSearch = () => (
    <View style={styles.searchWrapper}>
      <TouchableOpacity
        style={styles.searchTap}
        onPress={ctrl.handleSearchPress}
        activeOpacity={0.9}
      >
        <Icon name="magnify" size={22} color={colors.placeholder} />
        <Text style={styles.searchPlaceholder}>{t('home.search_placeholder')}</Text>
        <View style={styles.filterBtn}>
          <Icon name="tune-variant" size={20} color={colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderMerchant = useCallback(
    ({ item }: { item: Merchant }) => (
      <MerchantCard
        merchant={item}
        onPress={() => ctrl.handleMerchantPress(item.id)}
        style={{ width: SCREEN_WIDTH * 0.75, marginEnd: 12 }}
      />
    ),
    [ctrl.handleMerchantPress],
  );

  const homeCategories = ctrl.categories.slice(0, 7);

  return (
    <>
      <ScreenTemplate header={renderHeader()} backgroundColor={colors.background}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={ctrl.isRefreshing}
              onRefresh={ctrl.handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.bannerContainer}>
            {ctrl.isLoading ? (
              <Skeleton width="100%" height={160} style={{ borderRadius: 16 }} />
            ) : (
              <View style={styles.bannerWrapper}>
                <BannerSlider />
              </View>
            )}
          </View>

          {renderSearch()}

          <View style={styles.categoriesGrid}>
            {ctrl.categoriesLoading ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View key={i} style={styles.categoryCard}>
                    <Skeleton width={64} height={64} style={{ borderRadius: 16, marginBottom: 4 }} />
                    <Skeleton width={56} height={12} />
                  </View>
                ))}
              </>
            ) : homeCategories.length === 0 ? (
              <View style={styles.categoriesEmpty}>
                <Text style={styles.categoriesEmptyText}>{t('categories.no_results')}</Text>
              </View>
            ) : (
              <>
                {homeCategories.map((cat: Category, index: number) => {
                  const bg = PASTEL[index % PASTEL.length];
                  const iconRaw = (cat.icon || '').trim();
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryCard}
                      onPress={() =>
                        ctrl.handleCategoryPress(cat.id, ctrl.categoryDisplayName(cat))
                      }
                    >
                      <View style={[styles.categoryIconCircle, { backgroundColor: bg }]}>
                        {iconRaw && isMaterialStyleIcon(iconRaw) ? (
                          <Icon name={iconRaw as any} size={28} color={colors.primary} />
                        ) : (
                          <Text style={styles.categoryEmoji}>{iconRaw || '📦'}</Text>
                        )}
                      </View>
                      <Text style={styles.categoryLabel} numberOfLines={2}>
                        {ctrl.categoryDisplayName(cat)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={ctrl.handleSeeAllCategories}
                >
                  <View style={[styles.categoryIconCircle, { backgroundColor: colors.surfaceVariant }]}>
                    <Icon
                      name={I18nManager.isRTL ? 'arrow-left' : 'arrow-right'}
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>{t('home.see_all')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <SectionHeader
            title={t('home.special_offers', 'Special Offers')}
            onSeeAll={() => ctrl.navigate('PopularProductsScreen')}
          />
          {ctrl.isLoading ? (
            <View style={styles.skeletonRow}>
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  width={SCREEN_WIDTH * 0.7}
                  height={180}
                  style={{ borderRadius: 12, marginEnd: 12 }}
                />
              ))}
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {ctrl.products.slice(0, 4).map((product: Product) => (
                <View key={product.id} style={styles.productGridItem}>
                  <ProductCard
                    product={product}
                    onAdd={() => ctrl.handleProductAdd(product)}
                    isLiked={ctrl.isProductLiked(product.id)}
                    onToggleLike={() => ctrl.handleToggleFavorite(product.id)}
                  />
                </View>
              ))}
            </View>
          )}

          <SectionHeader
            title={t('home.nearby_title')}
            onSeeAll={() => ctrl.navigate('NearbyMerchantsScreen')}
          />
          {ctrl.isLoading ? (
            <View style={styles.skeletonRow}>
              {[1, 2].map((i) => (
                <Skeleton
                  key={i}
                  width={SCREEN_WIDTH * 0.7}
                  height={180}
                  style={{ borderRadius: 12, marginEnd: 12 }}
                />
              ))}
            </View>
          ) : (
            <FlatList<Merchant>
              data={ctrl.merchants}
              renderItem={renderMerchant}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.merchantsList}
              inverted={I18nManager.isRTL}
              snapToInterval={SCREEN_WIDTH * 0.75 + 12}
              decelerationRate="fast"
            />
          )}
        </ScrollView>
      </ScreenTemplate>

      <TouchableOpacity
        style={styles.fab}
        onPress={ctrl.handleCustomOrder}
        activeOpacity={0.9}
      >
        <Text style={styles.fabText}>{t('home.custom_order_btn')}</Text>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>

      <LocationBottomSheet
        ref={bottomSheetRef}
        onClose={closeLocationModal}
        onOpenMap={() => {
          closeLocationModal();
          ctrl.openLocationPicker();
        }}
        addresses={ctrl.delivery.addresses}
        addressesLoading={!!ctrl.user?.id && ctrl.delivery.addressesFetching}
        selectedAddressId={ctrl.delivery.selectedAddressId}
        onSelectAddress={(a) => {
          ctrl.selectSavedAddress(a);
          closeLocationModal();
        }}
        onUseCurrentLocation={() => {
          void ctrl.runSheetCurrentLocation();
        }}
        isGpsLoading={ctrl.sheetGpsBusy}
      />
    </>
  );
}

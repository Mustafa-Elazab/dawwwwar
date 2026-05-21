import React, { useRef, useCallback, useMemo } from 'react';
import { View, FlatList, ScrollView, I18nManager, Dimensions, RefreshControl } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Icon, Skeleton, AnimatedPressable, Button } from '@dawwar/ui';
import { useTheme, microInteractions } from '@dawwar/theme';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import { MerchantCard } from '../../components/MerchantCard';
import { ProductCard } from '../../../home/components/ProductCard';
import { SectionHeader } from '../../components/SectionHeader';
import { BannerSlider } from '../../components/BannerSlider';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Merchant, Product } from '@dawwar/types';
import { LocationBottomSheet } from '../../../location/components/LocationBottomSheet';
import { useAppSelector } from '../../../../store/hooks';
import { selectCartCount, selectCartTotal } from '../../../../store/slices/cart.slice';
import { selectAuthStatus } from '../../../../store/slices/auth.slice';
import { MODAL_ROUTES } from '../../../../navigation/routes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MERCHANT_CARD_STYLE = { width: 200, marginEnd: 12 } as const;

export function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [discoveryMode, setDiscoveryMode] = React.useState<'nearby' | 'country'>('nearby');
  const cartCount = useAppSelector(selectCartCount);
  const cartTotal = useAppSelector(selectCartTotal);
  const authStatus = useAppSelector(selectAuthStatus);
  const isGuest = authStatus === 'guest';

  const openLocationModal = () => {
    bottomSheetRef.current?.expand();
  };

  const closeLocationModal = () => {
    bottomSheetRef.current?.close();
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <View style={styles.greetingWrapper}>
          <Text style={styles.greetingText} numberOfLines={1}>
            {t('home.greeting', { name: ctrl.user?.name ? ctrl.user.name.split(' ')[0] : '' })}
          </Text>
          <Text style={styles.greetingSub}>{t('home.hero_subtitle')}</Text>
        </View>

        <View style={styles.headerActions}>
          <AnimatedPressable
            style={styles.bellBtn}
            onPress={ctrl.handleNotificationsPress}
            pressScale={microInteractions.pressScale}
            pressOpacity={microInteractions.pressOpacity}
            pressTranslateY={1}
          >
            <Icon name="bell-outline" size={22} color={colors.textSecondary} />
            <View style={styles.badgeDot} />
          </AnimatedPressable>
          <View style={styles.iconBtnGhost}>
            <Icon name="map-marker-outline" size={20} color={colors.textSecondary} />
          </View>
        </View>
      </View>

      <AnimatedPressable
        style={styles.locationBlock}
        onPress={openLocationModal}
        pressScale={microInteractions.pressScale}
        pressOpacity={microInteractions.pressOpacity}
        pressTranslateY={1}
      >
        <Text style={styles.deliveringLabel}>{t('home.delivering_to_label')}</Text>
        <View style={styles.locationRow}>
          <Icon name="chevron-down" size={14} color={colors.primary} />
          <Text style={styles.locationPrimary} numberOfLines={1}>
            {ctrl.isLocationLoading ? t('home.location_loading') : ctrl.headerLocationText}
          </Text>
          <Icon name="map-marker-outline" size={14} color={colors.primary} />
        </View>
      </AnimatedPressable>

      <AnimatedPressable
        style={styles.searchTap}
        onPress={ctrl.handleSearchPress}
        pressScale={microInteractions.pressScale}
        pressOpacity={microInteractions.pressOpacity}
        pressTranslateY={1}
      >
        <Icon name="magnify" size={20} color="#606060" />
        <Text style={styles.searchPlaceholder}>{t('home.search_placeholder')}</Text>
      </AnimatedPressable>

      <View style={styles.discoveryWrap}>
        <AnimatedPressable
          style={[styles.discoveryPill, discoveryMode === 'nearby' && styles.discoveryPillActive]}
          onPress={() => setDiscoveryMode('nearby')}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Text
            style={[styles.discoveryText, discoveryMode === 'nearby' && styles.discoveryTextActive]}
          >
            {t('home.discovery_nearby')}
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          style={[styles.discoveryPill, discoveryMode === 'country' && styles.discoveryPillActive]}
          onPress={() => setDiscoveryMode('country')}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Text
            style={[
              styles.discoveryText,
              discoveryMode === 'country' && styles.discoveryTextActive,
            ]}
          >
            {t('home.discovery_country')}
          </Text>
        </AnimatedPressable>
      </View>

      <FlatList
        horizontal
        data={ctrl.categories}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        inverted={I18nManager.isRTL}
        renderItem={({ item }) => (
          <AnimatedPressable
            style={styles.categoryChip}
            onPress={() => ctrl.handleCategoryPress(item.id, ctrl.categoryDisplayName(item))}
            pressScale={microInteractions.pressScale}
            pressOpacity={microInteractions.pressOpacity}
            pressTranslateY={1}
          >
            <Text style={styles.categoryEmoji}>{item.icon || '🍽️'}</Text>
            <Text numberOfLines={1} style={styles.categoryLabel}>
              {ctrl.categoryDisplayName(item)}
            </Text>
          </AnimatedPressable>
        )}
      />
    </View>
  );

  const renderMerchant = useCallback(
    ({ item }: { item: Merchant }) => (
      <MerchantCard
        merchant={item}
        onPress={() => ctrl.handleMerchantPress(item.id)}
        style={MERCHANT_CARD_STYLE}
      />
    ),
    [ctrl.handleMerchantPress],
  );

  const sections = useMemo(() => {
    const merchants = ctrl.merchants;
    const products = ctrl.products;

    const byDelivery = [...merchants].sort(
      (a, b) => (a.deliveryTimeMin ?? 99) - (b.deliveryTimeMin ?? 99),
    );
    const byRating = [...merchants].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));

    return [
      {
        id: 'recommended',
        title: t('home.recommended_for_you'),
        type: 'merchants' as const,
        data: merchants.slice(0, 8),
        onSeeAll: () => ctrl.navigate('NearbyMerchantsScreen'),
      },
      {
        id: 'trending',
        title: t('home.trending_now'),
        type: 'products' as const,
        data: products.slice(0, 6),
        onSeeAll: () => ctrl.navigate('PopularProductsScreen'),
      },
      {
        id: 'fast',
        title: t('home.fast_delivery'),
        type: 'merchants' as const,
        data: byDelivery.slice(0, 6),
      },
      {
        id: 'top_rated',
        title: t('home.top_rated_nearby'),
        type: 'merchants' as const,
        data: byRating.slice(0, 6),
      },
      {
        id: 'because_you_ordered',
        title: t('home.because_you_ordered'),
        type: 'products' as const,
        data: products.slice(2, 8),
      },
      {
        id: 'popular_tonight',
        title: t('home.popular_tonight'),
        type: 'merchants' as const,
        data: merchants.slice(2, 10),
      },
    ];
  }, [ctrl.merchants, ctrl.products, t, ctrl.navigate]);

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
          <BannerSlider />

          <View style={styles.heroCard}>
            <View style={styles.heroGlow} />
            <Text style={styles.heroTitle}>{t('home.hero_title')}</Text>
            <Text style={styles.heroCopy}>{t('home.hero_body')}</Text>
            <Button
              label={t('home.hero_cta')}
              onPress={ctrl.handleSearchPress}
              size="sm"
              style={styles.heroButton}
            />
          </View>

          {sections.map(section => (
            <View key={section.id} style={styles.sectionBlock}>
              <SectionHeader title={section.title} onSeeAll={section.onSeeAll} />

              {ctrl.isLoading ? (
                <View style={styles.skeletonRow}>
                  {[1, 2].map(i => (
                    <Skeleton
                      key={`${section.id}-${i}`}
                      width={SCREEN_WIDTH * 0.7}
                      height={180}
                      style={{ borderRadius: 16, marginEnd: 16 }}
                    />
                  ))}
                </View>
              ) : section.type === 'merchants' ? (
                <FlatList<Merchant>
                  data={section.data as Merchant[]}
                  renderItem={renderMerchant}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.merchantsList}
                  inverted={I18nManager.isRTL}
                  snapToInterval={SCREEN_WIDTH * 0.74 + 16}
                  decelerationRate="fast"
                  removeClippedSubviews
                />
              ) : (
                <View style={styles.productsGrid}>
                  {(section.data as Product[]).slice(0, 4).map(product => (
                    <View key={product.id} style={styles.productGridItem}>
                      <ProductCard product={product} onAdd={() => ctrl.handleProductAdd(product)} />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </ScreenTemplate>

      {cartCount > 0 ? (
        <Animated.View
          entering={SlideInDown.duration(200)}
          exiting={SlideOutDown.duration(150)}
          style={styles.cartBarWrap}
        >
          <AnimatedPressable
            style={styles.cartBar}
            onPress={() => {
              if (isGuest) {
                ctrl.navigate('Auth');
                return;
              }
              ctrl.navigate(MODAL_ROUTES.CART);
            }}
            pressScale={microInteractions.pressScale}
            pressOpacity={microInteractions.pressOpacity}
            pressTranslateY={1}
          >
            <View style={styles.cartCountBubble}>
              <Text style={styles.cartCountText}>{`${cartCount}`}</Text>
            </View>
            <Text style={styles.cartCta}>{t('cart.open_cart')}</Text>
            <Text style={styles.cartTotal}>{`${cartTotal} ${t('common.egp')}`}</Text>
          </AnimatedPressable>
        </Animated.View>
      ) : null}

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
        onSelectAddress={a => {
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

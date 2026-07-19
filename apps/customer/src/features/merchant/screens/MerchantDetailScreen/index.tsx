import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Animated, TouchableOpacity, I18nManager, SectionList, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '@dawwar/i18n';
import { AppScreenTemplate, Text, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { MerchantHeader } from '../../components/MerchantHeader';
import { MerchantTabBar } from '../../components/TabBar';
import { ProductRow } from '../../components/ProductRow';
import { CartBar } from '../../components/CartBar';
import { useController } from './useController';
import { createStyles } from './styles';
import { ALL_DAYS, formatHours } from '../../utils/hours';
import type { OpeningHours } from '@dawwar/types';
import { MerchantLoadingState } from './components/MerchantLoadingState';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export function MerchantDetailScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = React.useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const ctrl = useController();
  const insets = useSafeAreaInsets();
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const sectionListRef = useRef<SectionList>(null);
  const flatListRef = useRef<FlatList>(null);
  
  const [activeCategoryId, setActiveCategoryId] = useState('');
  
  useEffect(() => {
    if (ctrl.groupedProducts.length > 0 && !activeCategoryId) {
      setActiveCategoryId(ctrl.groupedProducts[0].categoryId);
    }
  }, [ctrl.groupedProducts, activeCategoryId]);

  const HEADER_HEIGHT = 220;
  const TAB_BAR_HEIGHT = 56;
  const CATEGORIES_HEIGHT = 60;
  
  const TOP_OFFSET = insets.top + 56;
  const SCROLL_THRESHOLD = Math.max(0, HEADER_HEIGHT + TAB_BAR_HEIGHT - TOP_OFFSET);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, Math.max(0, SCROLL_THRESHOLD - 20), SCROLL_THRESHOLD],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const categoriesTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [SCROLL_THRESHOLD, 0],
    extrapolate: 'clamp',
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      // Find the first item that is a section header or an item, get its section
      const topSection = viewableItems[0].section;
      if (topSection?.categoryId && topSection.categoryId !== activeCategoryId) {
        setActiveCategoryId(topSection.categoryId);
        const idx = ctrl.groupedProducts.findIndex((g) => g.categoryId === topSection.categoryId);
        if (idx >= 0 && flatListRef.current) {
          flatListRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
        }
      }
    }
  }).current;

  const handleCategoryPress = useCallback((idx: number, categoryId: string) => {
    setActiveCategoryId(categoryId);
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: idx,
        itemIndex: 0,
        viewPosition: 0,
        animated: true,
      });
    }
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: idx, animated: true, viewPosition: 0.5 });
    }
  }, [activeCategoryId, ctrl.groupedProducts]);

  const renderProductRow = React.useCallback(
    ({ item }: any) => (
      <ProductRow
        product={item}
        quantity={ctrl.getProductQuantity(item.id)}
        onAdd={() => ctrl.handleAddProduct(item)}
        onRemove={() => ctrl.handleRemoveProduct(item.id)}
        onPress={() => ctrl.handleProductPress(item.id)}
      />
    ),
    [ctrl.getProductQuantity, ctrl.handleAddProduct, ctrl.handleRemoveProduct]
  );

  const renderCategoryChip = React.useCallback(
    ({ item, index }: { item: any, index: number }) => {
      const isSelected = item.categoryId === activeCategoryId;
      return (
        <TouchableOpacity
          onPress={() => handleCategoryPress(index, item.categoryId)}
          style={[
            styles.categoryChip,
            isSelected && styles.categoryChipSelected,
          ]}
        >
          <Text style={[
            styles.categoryChipText,
            isSelected && styles.categoryChipTextSelected,
          ]}>
            {item.categoryName}
          </Text>
        </TouchableOpacity>
      );
    },
    [activeCategoryId, handleCategoryPress, styles.categoryChip, styles.categoryChipText, colors.primary]
  );

  const renderHeader = () => (
    <View>
      <MerchantHeader merchant={ctrl.merchant!} onBack={ctrl.handleBack} />
      <MerchantTabBar active={ctrl.activeTab} onChange={ctrl.setActiveTab} />
      {/* Spacer for the sticky categories */}
      {ctrl.activeTab === 'menu' && <View style={styles.categorySpacer} />}
    </View>
  );

  const renderContent = () => {
    if (ctrl.isLoading || !ctrl.merchant) {
      return <MerchantLoadingState colors={colors} isRTL={isRTL} />;
    }

    if (ctrl.activeTab === 'info') {
      return (
        <Animated.ScrollView
          style={styles.tabScroll}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          <View style={styles.infoTab}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('addresses.address_label')}</Text>
              <Text style={styles.infoValue}>{ctrl.merchant.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('merchant.hours')}</Text>
              <View style={styles.hoursTable}>
                {ALL_DAYS.map((day) => {
                  const h = ctrl.merchant?.openingHours[day as keyof OpeningHours] ?? null;
                  return (
                    <View key={day} style={styles.hoursRow}>
                      <Text style={styles.infoLabel}>{t(`days.${day.toLowerCase()}`)}</Text>
                      <Text style={styles.infoValue}>{formatHours(h)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      );
    }

    if (ctrl.activeTab === 'reviews') {
      return (
        <Animated.ScrollView
          style={styles.tabScroll}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
          scrollEventThrottle={16}
        >
          {renderHeader()}
          <View style={styles.reviewsPlaceholder}>
            <Text variant="body2" color={colors.textSecondary}>
              {t('merchant.reviews_soon')}
            </Text>
          </View>
        </Animated.ScrollView>
      );
    }

    const sections = ctrl.groupedProducts.map(g => ({
      ...g,
      data: g.products,
    }));

    return (
      <View style={styles.screen}>
        <AnimatedSectionList
          ref={sectionListRef as any}
          sections={sections}
          keyExtractor={(item: any) => item.id}
          ListHeaderComponent={renderHeader}
          stickySectionHeadersEnabled={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 10, minimumViewTime: 100 }}
          renderSectionHeader={({ section }: any) => (
            <View style={styles.categoryTitleContainer}>
              <Text variant="h4" color={colors.text} style={styles.categoryTitle}>
                {section.categoryName}
              </Text>
            </View>
          )}
          renderItem={renderProductRow}
          ListEmptyComponent={
            <View style={styles.emptyProducts}>
              <Text variant="body2" color={colors.textSecondary}>
                {t('merchant.no_products')}
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {/* Sticky Horizontal Categories */}
        {ctrl.groupedProducts.length > 0 && (
          <Animated.View
            style={[
              styles.stickyCategoriesWrapper,
              { top: TOP_OFFSET },
              { transform: [{ translateY: categoriesTranslateY }] }
            ]}
          >
            <FlatList
              ref={flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChipsContainer}
              inverted={I18nManager.isRTL}
              data={ctrl.groupedProducts}
              keyExtractor={(item) => item.categoryId}
              renderItem={renderCategoryChip}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <AppScreenTemplate
      edges={[]}
      backgroundColor={colors.background}
      contentStyle={styles.screen}
      isError={ctrl.isError}
      onRetry={ctrl.retry}
    >
      {renderContent()}

      {/* Header Overlay (Back Button & Title Fade) */}
      <View style={[styles.headerOverlay, { paddingTop: insets.top, height: TOP_OFFSET }]}>
        <Animated.View style={[styles.headerBackground, { opacity: headerOpacity, backgroundColor: colors.surface }]} />
        <View style={styles.headerContentWrapper}>
          <TouchableOpacity style={styles.headerButton} onPress={ctrl.handleBack}>
            <Icon name={I18nManager.isRTL ? 'chevron-right' : 'chevron-left'} size={24} color={colors.text} />
          </TouchableOpacity>
          <Animated.Text style={[styles.headerTitle, { opacity: headerOpacity }]} numberOfLines={1}>
            {ctrl.merchant?.businessName}
          </Animated.Text>
          <View style={styles.headerButtonPlaceholder} />
        </View>
      </View>

    
    </AppScreenTemplate>
  );
}

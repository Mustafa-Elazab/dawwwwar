import React, { useMemo } from 'react';
import { FlatList, I18nManager, StyleSheet, TouchableOpacity, View, type GestureResponderEvent } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from '@dawwar/i18n';
import { useTheme } from '@dawwar/theme';
import { EmptyState, Icon, ScreenTemplate, Skeleton, Text } from '@dawwar/ui';
import { useNavigation } from '@react-navigation/native';
import { useLikedProducts, useToggleFavorite } from '../../core/hooks';
import { HOME_ROUTES } from '../../../../navigation/routes';

export function LikedScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { data = [], isLoading, refetch } = useLikedProducts();
  const toggle = useToggleFavorite();

  return (
    <ScreenTemplate
      headerProps={{
        title: t('liked.title'),
        onBackPress: navigation.canGoBack() ? () => navigation.goBack() : undefined,
        type: 'none',
      }}
    >
      {isLoading ? (
        <View style={styles.grid}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} width="47%" height={190} style={{ borderRadius: 8 }} />
          ))}
        </View>
      ) : data.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title={t('liked.empty')}
          subtitle={t('liked.empty_sub')}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          onRefresh={refetch}
          refreshing={false}
          key={I18nManager.isRTL ? 'liked-rtl' : 'liked-ltr'}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => navigation.navigate(HOME_ROUTES.PRODUCT_DETAIL, { productId: item.productId })}
            >
              <View style={styles.imagePlaceholder}>
                <FastImage
                  source={{
                    uri:
                      item.product.images?.[0] ||
                      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
                  }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <TouchableOpacity
                  style={styles.heart}
                  hitSlop={10}
                  onPress={(event: GestureResponderEvent) => {
                    event.stopPropagation();
                    toggle.mutate({ productId: item.productId, liked: true });
                  }}
                >
                  <Icon name="heart" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {i18n.language.startsWith('ar')
                  ? item.product.nameAr || item.product.name
                  : item.product.name || item.product.nameAr}
              </Text>
              <View style={styles.ratingRow}>
                <Icon name="star" size={14} color="#FFC83D" />
                <Text style={styles.rating}>
                  4.9
                </Text>
              </View>
              <Text style={styles.price}>
                {item.product.price} {t('common.egp')}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </ScreenTemplate>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    grid: {
      paddingHorizontal: 24,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 20,
    },
    listContent: {
      paddingHorizontal: 24,
      paddingBottom: 110,
    },
    row: {
      justifyContent: 'space-between',
      gap: 16,
      marginBottom: 28,
    },
    card: {
      flex: 1,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.borderLight,
      overflow: 'hidden',
    },
    imagePlaceholder: {
      height: 96,
      backgroundColor: colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    heart: {
      position: 'absolute',
      top: 8,
      end: 8,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      paddingHorizontal: 8,
      paddingTop: 8,
      color: colors.text,
      fontWeight: '800',
      fontSize: 13,
      textAlign: 'auto',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingTop: 6,
    },
    rating: {
      color: colors.text,
      fontSize: 12,
    },
    price: {
      color: colors.primary,
      fontWeight: '800',
      paddingHorizontal: 8,
      paddingTop: 8,
      paddingBottom: 10,
    },
  });

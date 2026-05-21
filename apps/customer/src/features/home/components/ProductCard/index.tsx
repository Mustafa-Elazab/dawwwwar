import React from 'react';
import { View, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme, microInteractions } from '@dawwar/theme';
import { Text, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ProductCardProps } from './types';

export const ProductCard = React.memo(function ProductCard({
  product,
  merchantName,
  onAdd,
  style,
}: ProductCardProps & { style?: ViewStyle }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  const handleAdd = () => {
    if (product.isAvailable) onAdd();
  };

  const comparePrice = (product as any).comparePrice;
  const hasDiscount = comparePrice && comparePrice > product.price;
  const isFeatured = (product as any).isFeatured;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - product.price) / comparePrice) * 100)
    : 0;

  return (
    <View style={[styles.card, !product.isAvailable && styles.unavailable, style]}>
      <View style={styles.imageContainer}>
        <FastImage
          source={{
            uri:
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
            priority: FastImage.priority.normal,
          }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* Badges overlay */}
        <View style={styles.badges}>
          {hasDiscount && (
            <View style={[styles.badge, styles.badgeDiscount]}>
              <Text style={styles.badgeText}>-{discountPercent}%</Text>
            </View>
          )}
          {isFeatured && (
            <View style={[styles.badge, styles.badgePopular]}>
              <Icon name="fire" size={10} color="#fff" />
              <Text style={styles.badgeText}>{t('product.popular', 'Popular')}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.name} numberOfLines={2}>
            {product.nameAr}
          </Text>
          {merchantName != null && (
            <Text style={styles.merchantName} numberOfLines={1}>
              {merchantName}
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text style={styles.comparePrice}>
                {comparePrice} {t('common.egp')}
              </Text>
            )}
            <Text style={styles.price}>
              {product.price} {t('common.egp')}
            </Text>
          </View>

          <AnimatedPressable
            onPress={handleAdd}
            disabled={!product.isAvailable}
            pressScale={microInteractions.pressScale}
            pressOpacity={microInteractions.pressOpacity}
            pressTranslateY={1}
            style={styles.addBtn}
          >
            <Icon name={product.isAvailable ? 'plus' : 'close'} size={20} color="#fff" />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
});

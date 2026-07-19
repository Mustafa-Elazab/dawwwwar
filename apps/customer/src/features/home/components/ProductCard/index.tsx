import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ProductCardProps } from './types';

export const ProductCard = React.memo(function ProductCard({ product, merchantName, onAdd, onPress, isLiked, onToggleLike, style }: ProductCardProps & { style?: ViewStyle }) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t, i18n } = useTranslation();

  const handleAdd = () => {
    if (product.isAvailable) onAdd();
  };

  // Derive badges (assuming comparePrice exists on product, fallback to false if not typed)
  const comparePrice = (product as any).comparePrice;
  const hasDiscount = comparePrice && comparePrice > product.price;
  const isFeatured = (product as any).isFeatured;
  const productName = i18n.language.startsWith('ar')
    ? product.nameAr || product.name
    : product.name || product.nameAr;

  return (
    <TouchableOpacity
      style={[styles.card, !product.isAvailable && styles.unavailable, style]}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.imageContainer}>
        <FastImage
          source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000' }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        {/* Badges overlay */}
        <View style={styles.badges}>
          {hasDiscount && (
            <View style={[styles.badge, styles.badgeDiscount]}>
              <Text style={styles.badgeText}>Sale</Text>
            </View>
          )}
          {isFeatured && (
            <View style={[styles.badge, styles.badgePopular]}>
              <Text style={styles.badgeText}>Popular</Text>
            </View>
          )}
        </View>
        {onToggleLike ? (
          <TouchableOpacity style={styles.likeBtn} onPress={onToggleLike}>
            <Icon name={isLiked ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.body}>
        <View>
          <Text style={styles.name} numberOfLines={2}>
            {productName}
          </Text>
          {merchantName != null && (
            <Text style={styles.merchantName} numberOfLines={1}>
              {merchantName}
            </Text>
          )}
        </View>
        
        <View style={[styles.footer, { zIndex: 10 }]}>
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
          
          <TouchableOpacity 
            onPress={handleAdd}
            disabled={!product.isAvailable}
            activeOpacity={0.7}
            style={styles.addBtn}
          >
            <Icon
              name={product.isAvailable ? 'plus' : 'close'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

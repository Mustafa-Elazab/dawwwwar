import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ProductCardProps } from './types';

export function ProductCard({ product, merchantName, onAdd }: ProductCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={[styles.card, !product.isAvailable && styles.unavailable]}>
      <Image
        source={{ uri: product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.nameAr}
        </Text>
        {merchantName != null && (
          <Text style={styles.merchantName} numberOfLines={1}>
            {merchantName}
          </Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {product.price} {t('common.egp')}
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={onAdd}
            disabled={!product.isAvailable}
          >
            <Icon
              name={product.isAvailable ? 'plus' : 'close'}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

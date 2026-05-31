import React from 'react';
import { Image, View } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { Icon, Text } from '@dawwar/ui';
import { createStyles } from '../styles';
import type { OrderDetailItemView } from '../useController';

interface OrderItemsSectionProps {
  colors: AppColors;
  isRTL: boolean;
  items: OrderDetailItemView[];
}

export function OrderItemsSection({ colors, isRTL, items }: OrderItemsSectionProps) {
  const styles = createStyles(colors, isRTL);

  if (items.length === 0) return null;

  return (
    <View style={styles.section}>
      {items.map((item) => (
        <View key={item.id} style={styles.itemRow}>
          <View style={styles.itemThumb}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <Icon name="food" size={24} color={colors.primary} />
            )}
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemMeta}>{item.meta}</Text>
          </View>
          <Text style={styles.itemPrice}>{item.price}</Text>
        </View>
      ))}
    </View>
  );
}

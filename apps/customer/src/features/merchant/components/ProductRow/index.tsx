import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Badge } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ProductRowProps } from './types';

export function ProductRow({ product, quantity, onAdd, onRemove }: ProductRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={[styles.row, !product.isAvailable && { opacity: 0.5 }]}>
      <Image
        source={{ uri: product.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{product.nameAr}</Text>
        {product.description != null && product.description !== '' && (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        )}
        <Text style={styles.price}>
          {product.price} {t('common.egp')}
        </Text>
        {!product.isAvailable && (
          <Badge
            label={t('merchant.unavailable')}
            variant="neutral"
            size="sm"
            style={styles.unavailableBadge}
          />
        )}
      </View>

      {product.isAvailable ? (
        quantity > 0 ? (
          <View style={styles.stepper}>
            <TouchableOpacity style={[styles.stepperBtn, styles.stepperBtnMinus]} onPress={onRemove}>
              <Icon name="minus" size={14} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.stepperCount}>{String(quantity)}</Text>
            <TouchableOpacity style={styles.stepperBtn} onPress={onAdd}>
              <Icon name="plus" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Icon name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        )
      ) : null}
    </View>
  );
}

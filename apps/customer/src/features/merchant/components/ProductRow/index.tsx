import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, I18nManager } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon, Badge } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { ProductRowProps } from './types';

export const ProductRow = React.memo(function ProductRow({ product, quantity = 0, onAdd, onRemove }: ProductRowProps) {
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language.startsWith('ar') || I18nManager.isRTL;
  const styles = React.useMemo(() => createStyles(colors, isRTL), [colors, isRTL]);
  const productName = i18n.language.startsWith('ar')
    ? product.nameAr || product.name
    : product.name || product.nameAr;
  const description = i18n.language.startsWith('ar')
    ? product.descriptionAr || product.description
    : product.description || product.descriptionAr;

  return (
    <View style={[styles.row, !product.isAvailable && { opacity: 0.5 }]}>
      <Image
        source={{ uri: product.images[0] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{productName}</Text>
        {description != null && description !== '' && (
          <Text style={styles.description} numberOfLines={2}>
            {description}
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
});

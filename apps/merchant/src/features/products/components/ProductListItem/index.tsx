import React from 'react';
import { View, Switch, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { Product } from '@dawwar/types';

interface ProductListItemProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (isAvailable: boolean) => void;
  isTogglingId?: string;
}

export function ProductListItem({
  product, onEdit, onDelete, onToggle, isTogglingId,
}: ProductListItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const confirmDelete = () => {
    Alert.alert(
      t('merchant_app.delete_product_title'),
      t('merchant_app.delete_product_body'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: onDelete },
      ],
    );
  };

  return (
    <View style={[styles.row, !product.isAvailable && styles.unavailable]}>
      <FastImage source={{ uri: product.images[0] }} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.nameAr}</Text>
        <Text style={styles.price}>{product.price} {t('common.egp')}</Text>
      </View>
      {/* Availability toggle */}
      <Switch
        value={product.isAvailable}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primaryMuted }}
        thumbColor={product.isAvailable ? colors.primary : colors.textDisabled}
        disabled={isTogglingId === product.id}
      />
      {/* Edit icon */}
      <Icon name="pencil-outline" size={20} color={colors.icon} onPress={onEdit} />
      {/* Delete icon */}
      <Icon name="trash-can-outline" size={20} color={colors.error} onPress={confirmDelete} />
    </View>
  );
}

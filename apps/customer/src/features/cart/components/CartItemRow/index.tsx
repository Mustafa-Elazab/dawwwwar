import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { CartItemRowProps } from './types';

export function CartItemRow({ item, onAdd, onRemove }: CartItemRowProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nameAr}</Text>
        <Text style={styles.price}>
          {item.price * item.quantity} {t('common.egp')}
        </Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepBtn, item.quantity > 1 && styles.stepBtnActive]}
          onPress={onRemove}
        >
          <Icon
            name={item.quantity === 1 ? 'trash-can-outline' : 'minus'}
            size={14}
            color={item.quantity > 1 ? colors.primary : colors.error}
          />
        </TouchableOpacity>
        <Text style={styles.count}>{String(item.quantity)}</Text>
        <TouchableOpacity style={[styles.stepBtn, styles.stepBtnActive]} onPress={onAdd}>
          <Icon name="plus" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

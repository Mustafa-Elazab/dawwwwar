import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { createStyles } from './styles';
import type { CartItemRowProps } from './types';

export const CartItemRow = React.memo(function CartItemRow({ item, onAdd, onRemove }: CartItemRowProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <Image 
        source={{ uri: item.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000' }} 
        style={styles.image} 
        resizeMode="cover" 
      />
      
      <View style={styles.info}>
        <Text style={styles.name}>{item.nameAr}</Text>
        <Text style={styles.merchantName}>{item.merchantNameAr || item.merchantName}</Text>
        <Text style={styles.price}>
          {item.price * item.quantity} {t('common.egp')}
        </Text>
      </View>

      <View style={styles.stepper}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Icon
            name={item.quantity === 1 ? 'trash-can-outline' : 'minus'}
            size={18}
            color={item.quantity === 1 ? colors.error : colors.primary}
          />
        </TouchableOpacity>
        
        <Text style={styles.count}>{String(item.quantity)}</Text>
        
        <TouchableOpacity 
          style={styles.stepBtn} 
          onPress={onAdd}
          activeOpacity={0.7}
        >
          <Icon name="plus" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

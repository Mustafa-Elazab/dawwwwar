import React from 'react';
import { View } from 'react-native';
import { useTheme, microInteractions } from '@dawwar/theme';
import { Text, Icon, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import FastImage from 'react-native-fast-image';
import { createStyles } from './styles';
import type { CartItemRowProps } from './types';

export const CartItemRow = React.memo(function CartItemRow({
  item,
  onAdd,
  onRemove,
}: CartItemRowProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <FastImage
        source={{
          uri:
            item.image ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
          priority: FastImage.priority.normal,
        }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.nameAr}</Text>
        <Text style={styles.merchantName}>{item.merchantNameAr || item.merchantName}</Text>
        <Text style={styles.price}>
          {item.price * item.quantity} {t('common.egp')}
        </Text>
      </View>

      <View style={styles.stepper}>
        <AnimatedPressable
          style={styles.stepBtn}
          onPress={onRemove}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Icon
            name={item.quantity === 1 ? 'trash-can-outline' : 'minus'}
            size={18}
            color={item.quantity === 1 ? colors.error : colors.primary}
          />
        </AnimatedPressable>

        <Text style={styles.count}>{String(item.quantity)}</Text>

        <AnimatedPressable
          style={styles.stepBtn}
          onPress={onAdd}
          pressScale={microInteractions.pressScale}
          pressOpacity={microInteractions.pressOpacity}
          pressTranslateY={1}
        >
          <Icon name="plus" size={18} color={colors.primary} />
        </AnimatedPressable>
      </View>
    </View>
  );
});

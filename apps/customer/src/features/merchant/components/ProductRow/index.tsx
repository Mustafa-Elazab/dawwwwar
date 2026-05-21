import React from 'react';
import { View } from 'react-native';
import { useTheme, microInteractions } from '@dawwar/theme';
import { Text, Icon, Badge, AnimatedPressable } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import FastImage from 'react-native-fast-image';
import { createStyles } from './styles';
import type { ProductRowProps } from './types';

export const ProductRow = React.memo(function ProductRow({
  product,
  quantity = 0,
  onAdd,
  onRemove,
}: ProductRowProps) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation();

  return (
    <View style={[styles.row, !product.isAvailable && styles.unavailableBadge && { opacity: 0.5 }]}>
      <FastImage
        source={{
          uri:
            product.images[0] ||
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000',
          priority: FastImage.priority.normal,
        }}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
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
            <AnimatedPressable
              style={[styles.stepperBtn, styles.stepperBtnMinus]}
              onPress={onRemove}
              pressScale={microInteractions.pressScale}
              pressOpacity={microInteractions.pressOpacity}
              pressTranslateY={1}
            >
              <Icon name="minus" size={14} color={colors.text} />
            </AnimatedPressable>
            <Text style={styles.stepperCount}>{String(quantity)}</Text>
            <AnimatedPressable
              style={styles.stepperBtn}
              onPress={onAdd}
              pressScale={microInteractions.pressScale}
              pressOpacity={microInteractions.pressOpacity}
              pressTranslateY={1}
            >
              <Icon name="plus" size={14} color="#fff" />
            </AnimatedPressable>
          </View>
        ) : (
          <AnimatedPressable
            style={styles.addBtn}
            onPress={onAdd}
            pressScale={microInteractions.pressScale}
            pressOpacity={microInteractions.pressOpacity}
            pressTranslateY={1}
          >
            <Icon name="plus" size={18} color="#fff" />
          </AnimatedPressable>
        )
      ) : null}
    </View>
  );
});

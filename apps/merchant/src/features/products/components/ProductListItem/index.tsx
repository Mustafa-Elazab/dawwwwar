import React, { useRef, useCallback } from 'react';
import { View, TouchableOpacity, Switch, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Icon } from '@dawwar/ui';
import { space } from '@dawwar/theme';
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
  product,
  onEdit,
  onDelete,
  onToggle,
  isTogglingId,
}: ProductListItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = useCallback(() => {
    swipeableRef.current?.close();
  }, []);

  const handleDelete = useCallback(() => {
    closeSwipeable();
    // Small delay so swipeable closes before Alert appears
    setTimeout(() => onDelete(), 150);
  }, [closeSwipeable, onDelete]);

  // Red "Delete" action revealed on swipe-left
  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      const scale = dragX.interpolate({
        inputRange: [-80, 0],
        outputRange: [1, 0.8],
        extrapolate: 'clamp',
      });

      return (
        <TouchableOpacity
          style={[
            styles.swipeAction,
            { backgroundColor: colors.error },
          ]}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Animated.View
            style={[styles.swipeActionInner, { transform: [{ scale }] }]}
          >
            <Icon name="trash-can-outline" size={22} color="#fff" />
            <Text variant="caption" color="#fff" style={{ fontWeight: '700' }}>
              {t('common.delete')}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      );
    },
    [colors.error, handleDelete, styles.swipeAction, styles.swipeActionInner, t],
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      friction={2}
      overshootRight={false}
    >
      <View style={[styles.row, !product.isAvailable && styles.unavailable]}>
        <FastImage
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
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

        {/* Edit icon still visible */}
        <TouchableOpacity onPress={onEdit} style={{ padding: space[1] }}>
          <Icon name="pencil-outline" size={20} color={colors.icon} />
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

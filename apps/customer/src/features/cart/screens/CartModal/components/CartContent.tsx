import React from 'react';
import { ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
import type { AppColors } from '@dawwar/theme';
import { EmptyState, Icon, Text } from '@dawwar/ui';
import { CartItemRow } from '../../../components/CartItemRow';
import { createStyles } from '../styles';

interface CartContentProps {
  colors: AppColors;
  items: any[];
  isEmpty: boolean;
  subtotal: number;
  deliveryFee: number;
  total: number;
  isFeeLoading: boolean;
  labels: {
    empty: string;
    emptySubtitle: string;
    continueShopping: string;
    promoPlaceholder: string;
    apply: string;
    subtotal: string;
    deliveryFee: string;
    total: string;
    egp: string;
    loading: string;
  };
  onClose: () => void;
  onAdd: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export function CartContent({
  colors,
  items,
  isEmpty,
  subtotal,
  deliveryFee,
  total,
  isFeeLoading,
  labels,
  onClose,
  onAdd,
  onRemove,
}: CartContentProps) {
  const styles = createStyles(colors);

  if (isEmpty) {
    return (
      <EmptyState
        icon="cart-outline"
        title={labels.empty}
        subtitle={labels.emptySubtitle}
        action={{ label: labels.continueShopping, onPress: onClose }}
      />
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.list}>
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onAdd={() => onAdd(item.productId)}
            onRemove={() => onRemove(item.productId)}
          />
        ))}
      </View>

      <View style={styles.promoWrapper}>
        <Icon name="tag-outline" size={20} color={colors.primary} />
        <TextInput
          style={styles.promoInput}
          placeholder={labels.promoPlaceholder}
          placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={styles.promoBtn}>{labels.apply}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{labels.subtotal}</Text>
          <Text style={styles.summaryValue}>
            {subtotal} {labels.egp}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{labels.deliveryFee}</Text>
          <Text style={styles.summaryValue}>
            {isFeeLoading ? labels.loading : `${deliveryFee} ${labels.egp}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{labels.total}</Text>
          <Text style={styles.totalValue}>
            {total} {labels.egp}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

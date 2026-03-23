import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Text, Icon, Button, EmptyState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { CartItemRow } from '../../components/CartItemRow';
import { useController } from './useController';
import { createStyles } from './styles';
import type { CartItem } from '../../../../store/slices/cart.slice';

export function CartModal() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate edges={['bottom']} backgroundColor={colors.card}>
      {/* Drag handle pill */}
      <View style={styles.handle} />

      {/* Header row */}
      <View style={styles.header}>
        <Text style={styles.title}>{ctrl.t('cart.title')}</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={ctrl.handleClose}>
          <Icon name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {ctrl.isEmpty ? (
        <EmptyState
          icon="cart-outline"
          title={ctrl.t('cart.empty')}
          subtitle={ctrl.t('cart.empty_sub')}
          action={{ label: ctrl.t('cart.continue_shopping'), onPress: ctrl.handleClose }}
        />
      ) : (
        <>
          {/* Items */}
          <FlatList<CartItem>
            data={ctrl.items}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onAdd={() => ctrl.handleAdd(item.productId)}
                onRemove={() => ctrl.handleRemove(item.productId)}
              />
            )}
            keyExtractor={(item) => item.productId}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary + checkout */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{ctrl.t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>
                {ctrl.subtotal} {ctrl.t('common.egp')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{ctrl.t('cart.delivery_fee')}</Text>
              <Text style={styles.summaryValue}>
                {ctrl.deliveryFee} {ctrl.t('common.egp')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>{ctrl.t('cart.total')}</Text>
              <Text style={styles.totalValue}>
                {ctrl.total} {ctrl.t('common.egp')}
              </Text>
            </View>
            <Button
              label={`${ctrl.t('cart.checkout')} · ${ctrl.total} ${ctrl.t('common.egp')}`}
              onPress={ctrl.handleCheckout}
              fullWidth
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}
    </ScreenTemplate>
  );
}

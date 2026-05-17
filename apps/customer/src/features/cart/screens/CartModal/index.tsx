import React, { useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, I18nManager } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, Icon, Button, EmptyState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { CartItemRow } from '../../components/CartItemRow';
import { useController } from './useController';
import { createStyles } from './styles';

export function CartModal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  return (
    <ScreenTemplate 
      backgroundColor={colors.card}
      headerProps={{
        title: t('cart.title'),
        rightAction: { icon: 'close', onPress: ctrl.handleClose },
        type: 'none',
      }}
      footer={
        !ctrl.isEmpty && (
          <View style={styles.footer}>
             <Button
                label={`${t('cart.checkout')} · ${ctrl.total} ${t('common.egp')}`}
                onPress={ctrl.handleCheckout}
                fullWidth
                style={styles.checkoutBtn}
              />
          </View>
        )
      }
    >
      <View style={styles.handle} />

      {ctrl.isEmpty ? (
        <EmptyState
          icon="cart-outline"
          title={t('cart.empty')}
          subtitle={t('cart.empty_sub')}
          action={{ label: t('cart.continue_shopping'), onPress: ctrl.handleClose }}
        />
      ) : (
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Items List */}
          <View style={styles.list}>
            {ctrl.items.map((item) => (
              <CartItemRow
                key={item.productId}
                item={item}
                onAdd={() => ctrl.handleAdd(item.productId)}
                onRemove={() => ctrl.handleRemove(item.productId)}
              />
            ))}
          </View>

          {/* Promo Code Input */}
          <View style={styles.promoWrapper}>
            <Icon name="tag-outline" size={20} color={colors.primary} />
            <TextInput 
              style={styles.promoInput}
              placeholder={t('cart.promo_placeholder', 'هل لديك كود خصم؟')}
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.promoBtn}>{t('cart.apply', 'تطبيق')}</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Section */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
              <Text style={styles.summaryValue}>
                {ctrl.subtotal} {t('common.egp')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.delivery_fee')}</Text>
              <Text style={styles.summaryValue}>
                {ctrl.deliveryFee} {t('common.egp')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('cart.total')}</Text>
              <Text style={styles.totalValue}>
                {ctrl.total} {t('common.egp')}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenTemplate>
  );
}

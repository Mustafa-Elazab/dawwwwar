import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollScreenTemplate, Header, Text, Input, Button, Divider } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { PaymentMethod } from '@dawwar/types';
import { useController } from './useController';
import { createStyles } from './styles';

export function CheckoutScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScrollScreenTemplate
      header={
        <Header
          title={ctrl.t('checkout.title')}
          leftAction={{ icon: 'arrow-left', onPress: ctrl.handleBack }}
        />
      }
      edges={['bottom']}
      footer={
        <Button
          label={
            ctrl.isLoading
              ? ctrl.t('checkout.placing')
              : `${ctrl.t('checkout.place_order')} · ${ctrl.total} ${ctrl.t('common.egp')}`
          }
          onPress={ctrl.handlePlaceOrder}
          loading={ctrl.isLoading}
          disabled={ctrl.isButtonDisabled}
          fullWidth
          style={styles.placeOrderBtn}
        />
      }
    >
      {/* Delivery Address */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ctrl.t('checkout.delivery_title')}</Text>
        <View style={styles.addressRow}>
          <View>
            <Text style={styles.addressLabel}>{ctrl.address.label}</Text>
            <Text style={styles.addressText}>{ctrl.address.address}</Text>
          </View>
          <TouchableOpacity>
            <Text variant="label" color={colors.primary}>
              {ctrl.t('checkout.change_address')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ctrl.t('checkout.payment_title')}</Text>

        {/* Cash */}
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => ctrl.setPaymentMethod(PaymentMethod.CASH)}
        >
          <View
            style={[
              styles.radio,
              ctrl.paymentMethod === PaymentMethod.CASH && styles.radioSelected,
            ]}
          >
            {ctrl.paymentMethod === PaymentMethod.CASH && <View style={styles.radioDot} />}
          </View>
          <View>
            <Text style={styles.paymentLabel}>{ctrl.t('checkout.cash')}</Text>
            <Text style={styles.paymentSub}>{ctrl.t('checkout.cash_sub')}</Text>
          </View>
        </TouchableOpacity>

        {/* Wallet */}
        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() => ctrl.setPaymentMethod(PaymentMethod.WALLET)}
        >
          <View
            style={[
              styles.radio,
              ctrl.paymentMethod === PaymentMethod.WALLET && styles.radioSelected,
            ]}
          >
            {ctrl.paymentMethod === PaymentMethod.WALLET && <View style={styles.radioDot} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentLabel}>{ctrl.t('checkout.wallet')}</Text>
            <Text style={styles.paymentSub}>
              {ctrl.t('checkout.wallet_balance', { amount: ctrl.walletBalance })}
            </Text>
            {ctrl.isWalletInsufficient && (
              <Text style={styles.paymentError}>
                {ctrl.t('checkout.wallet_low', {
                  amount: ctrl.total - ctrl.walletBalance,
                })}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Order notes */}
      <View style={styles.section}>
        <Input
          label={ctrl.t('checkout.notes_label')}
          value={ctrl.notes}
          onChangeText={ctrl.setNotes}
          placeholder={ctrl.t('checkout.notes_placeholder')}
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Order summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{ctrl.t('checkout.summary_title')}</Text>
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
        <Divider />
        <View style={[styles.summaryRow, { marginTop: 8 }]}>
          <Text style={styles.totalLabel}>{ctrl.t('cart.total')}</Text>
          <Text style={styles.totalValue}>
            {ctrl.total} {ctrl.t('common.egp')}
          </Text>
        </View>
      </View>
    </ScrollScreenTemplate>
  );
}

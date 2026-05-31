import React from 'react';
import { View, TouchableOpacity, I18nManager } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScrollScreenTemplate, Text, Input, Button, Divider, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { PaymentMethod } from '@dawwar/types';
import { useController } from './useController';
import { createStyles } from './styles';
import type { TFunction } from 'i18next';

const getLocalizedLabel = (label: string, t: TFunction) => {
  const map: Record<string, string> = {
    home: t('address_labels.home', 'المنزل'),
    work: t('address_labels.work', 'العمل'),
    other: t('address_labels.other', 'أخرى'),
  };
  return map[label?.toLowerCase()] ?? label;
};

export function CheckoutScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  const displayLabel = ctrl.address ? getLocalizedLabel(ctrl.address.label ?? '', t) : t('checkout.no_address');

  return (
    <ScrollScreenTemplate
      headerProps={{ 
        title: t('checkout.title'),
        onBackPress: ctrl.handleBack,
      }}
      footer={
        <View style={styles.footer}>
          <Button
            label={
              ctrl.isLoading
                ? t('checkout.placing')
                : `${t('checkout.place_order')} · ${ctrl.total} ${t('common.egp')}`
            }
            onPress={ctrl.handlePlaceOrder}
            loading={ctrl.isLoading}
            disabled={ctrl.isButtonDisabled}
            fullWidth
            style={styles.placeOrderBtn}
          />
        </View>
      }
    >
      {/* Delivery Address */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('checkout.delivery_title')}</Text>

          {/* <TouchableOpacity onPress={() => navigation.navigate('CustomerTabs', { screen: 'ProfileTab', params: { screen: 'AddAddressScreen', params: {} } })}>
            <Text variant="label" color={colors.primary} style={{ fontWeight: '800' }}>
              {ctrl.address ? t('checkout.change_address') : t('checkout.add_address')}
            </Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.addressRow}>
          <View style={styles.iconCircle}>
            <Icon name={ctrl.address?.label?.toLowerCase() === 'home' ? 'home' : 'map-marker'} size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressLabel}>{displayLabel}</Text>
            <Text style={styles.addressText} numberOfLines={2}>{ctrl.address?.address ?? t('checkout.add_address_hint')}</Text>
          </View>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('checkout.payment_title')}</Text>

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
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>{t('checkout.cash')}</Text>
            <Text style={styles.paymentSub}>{t('checkout.cash_sub')}</Text>
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
          <View style={[styles.paymentInfo, { flex: 1 }]}>
            <Text style={styles.paymentLabel}>{t('checkout.wallet')}</Text>
            <Text style={styles.paymentSub}>
              {t('checkout.wallet_balance', { amount: ctrl.walletBalance })}
            </Text>
            {ctrl.isWalletInsufficient && (
              <Text style={styles.paymentError}>
                {t('checkout.wallet_low', {
                  amount: ctrl.total - ctrl.walletBalance,
                })}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Order notes with character counter */}
      <View style={styles.section}>
        <View style={styles.notesHeader}>
        <Text style={styles.sectionTitle}>{t('checkout.notes_label')}</Text>

          <Text style={styles.charCount}>{ctrl.notes.length}/200</Text>
        </View>
        <Input
          value={ctrl.notes}
          onChangeText={(text) => text.length <= 200 && ctrl.setNotes(text)}
          placeholder={t('checkout.notes_placeholder')}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
      </View>

      {/* Order summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('checkout.summary_title')}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
          <Text style={styles.summaryValue}>
            {ctrl.subtotal} {t('common.egp')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.delivery_fee')}</Text>
          <View style={{ alignItems: 'flex-end' }}>
            {ctrl.isFree ? (
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                {t('checkout.free_delivery', 'Free Delivery')} 🎉
              </Text>
            ) : (
              <Text style={styles.summaryValue}>
                {ctrl.deliveryFee} {t('common.egp')}
              </Text>
            )}
            {ctrl.distanceKm != null && (
              <Text style={styles.charCount}>({ctrl.distanceKm.toFixed(1)} km)</Text>
            )}
          </View>
        </View>
        <Divider />
        <View style={[styles.summaryRow, { marginTop: 8 }]}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalValue}>
            {ctrl.total} {t('common.egp')}
          </Text>
        </View>
      </View>
    </ScrollScreenTemplate>
  );
}

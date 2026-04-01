import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '@dawwar/theme';
import { Text, Badge, Button, Icon } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { OrderType, PaymentMethod } from '@dawwar/types';
import { EarningsBreakdown } from '../EarningsBreakdown';
import { VoiceNotePlayer } from '../VoiceNotePlayer';
import { createStyles } from './styles';
import type { OrderPreviewCardProps } from './types';

export function OrderPreviewCard({
  order, onAccept, onDecline, isAccepting,
}: OrderPreviewCardProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const isCustom = order.type === OrderType.CUSTOM;
  const isCash = order.paymentMethod === PaymentMethod.CASH;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.orderNum}>{order.orderNumber}</Text>
        <View style={styles.paymentBadge}>
          <Badge
            label={isCustom ? t('driver.custom_order') : t('driver.regular_order')}
            variant={isCustom ? 'warning' : 'info'}
            size="sm"
          />
          <Badge
            label={isCash ? t('driver.cash_payment') : t('driver.wallet_payment')}
            variant="neutral"
            size="sm"
          />
        </View>
      </View>

      <View style={styles.body}>

        {/* Pickup location */}
        <View>
          <Text style={styles.sectionLabel}>
            {isCustom ? t('custom_order.shop_section') : t('merchant.tab_info')}
          </Text>
          <Text style={styles.addressText}>
            {isCustom ? order.shopAddress : order.merchant?.address ?? '—'}
          </Text>
        </View>

        {/* Delivery location */}
        <View>
          <Text style={styles.sectionLabel}>{t('checkout.delivery_title')}</Text>
          <Text style={styles.addressText}>{order.deliveryAddress}</Text>
        </View>

        {/* Custom order: description + voice + photos */}
        {isCustom && (
          <>
            {order.itemsDescription && (
              <View>
                <Text style={styles.sectionLabel}>{t('custom_order.items_section')}</Text>
                <Text style={styles.descriptionText}>{order.itemsDescription}</Text>
              </View>
            )}

            {order.itemsVoiceNote && (
              <View>
                <Text style={styles.sectionLabel}>{t('custom_order.voice_label')}</Text>
                <VoiceNotePlayer uri={order.itemsVoiceNote} />
              </View>
            )}

            {order.itemsImages && order.itemsImages.length > 0 && (
              <View>
                <Text style={styles.sectionLabel}>{t('custom_order.photos_label')}</Text>
                <View style={styles.photoGrid}>
                  {order.itemsImages.map((uri, i) => (
                    <FastImage
                      key={i}
                      source={{ uri }}
                      style={styles.photoThumb}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  ))}
                </View>
              </View>
            )}

            {order.estimatedBudget && (
              <View>
                <Text style={styles.sectionLabel}>{t('custom_order.budget_section')}</Text>
                <Text style={styles.addressText}>
                  ~{order.estimatedBudget} {t('common.egp')}
                </Text>
              </View>
            )}

            {/* Warning for custom orders */}
            <View style={styles.customWarning}>
              <Icon name="alert" size={16} color={colors.warning} />
              <Text style={styles.warningText}>
                {t('driver.custom_order_warning')}
              </Text>
            </View>
          </>
        )}

        {/* Regular order: items list */}
        {!isCustom && order.items && order.items.length > 0 && (
          <View>
            <Text style={styles.sectionLabel}>Items ({order.items.length})</Text>
            {order.items.slice(0, 3).map((item) => (
              <Text key={item.id} variant="body2" color={colors.textSecondary}>
                {item.quantity}× {item.productName}
              </Text>
            ))}
            {order.items.length > 3 && (
              <Text variant="caption" color={colors.textDisabled}>
                +{order.items.length - 3} more
              </Text>
            )}
          </View>
        )}

        {/* Earnings breakdown */}
        <EarningsBreakdown deliveryFee={order.deliveryFee} />
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Button
          label={t('driver.decline')}
          onPress={onDecline}
          variant="outline"
          style={styles.declineBtn}
        />
        <Button
          label={t('driver.accept')}
          onPress={onAccept}
          loading={isAccepting}
          style={styles.acceptBtn}
        />
      </View>
    </View>
  );
}

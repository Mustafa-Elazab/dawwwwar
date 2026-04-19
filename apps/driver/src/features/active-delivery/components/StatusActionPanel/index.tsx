import React from 'react';
import { View, Linking } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Button } from '@dawwar/ui';
import { useTranslation } from '@dawwar/i18n';
import { OrderStatus, OrderType } from '@dawwar/types';
import { createStyles } from './styles';
import type { StatusActionPanelProps } from './types';

export function StatusActionPanel({
  status,
  orderType,
  isLoading,
  onNavigate,
  onArrived,
  onConfirmPickup,
  onCallContact,
  onConfirmDelivery,
}: StatusActionPanelProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const isCustom = orderType === OrderType.CUSTOM;

  return (
    <View style={styles.panel}>

      {/* DRIVER_ASSIGNED → heading to pickup/shop */}
      {status === OrderStatus.DRIVER_ASSIGNED && (
        <>
          <View style={styles.row}>
            <Button label={t('driver.navigate')} onPress={onNavigate} variant="outline" style={styles.halfBtn} />
            <Button label={t('driver.call_merchant')} onPress={onCallContact} variant="outline" style={styles.halfBtn} />
          </View>
          <Button
            label={isCustom ? t('driver.arrived_shop') : t('driver.arrived_pickup')}
            onPress={onArrived}
            loading={isLoading}
            fullWidth
          />
        </>
      )}

      {/* AT_SHOP / AT_MERCHANT → confirm pickup */}
      {(status === OrderStatus.AT_SHOP || status === 'AT_MERCHANT' as OrderStatus) && !isCustom && (
        <Button
          label={t('driver.confirm_pickup')}
          onPress={onConfirmPickup}
          loading={isLoading}
          fullWidth
        />
      )}

      {/* IN_TRANSIT / PURCHASED → heading to customer */}
      {(status === OrderStatus.IN_TRANSIT || status === OrderStatus.PURCHASED) && (
        <>
          <View style={styles.row}>
            <Button label={t('driver.navigate_customer')} onPress={onNavigate} variant="outline" style={styles.halfBtn} />
            <Button label={t('driver.call_customer')} onPress={onCallContact} variant="outline" style={styles.halfBtn} />
          </View>
          <Button
            label={t('driver.arrived_customer')}
            onPress={onArrived}
            loading={isLoading}
            fullWidth
          />
        </>
      )}

      {/* DELIVERED → collect cash */}
      {status === OrderStatus.DELIVERED && (
        <Button
          label={t('driver.confirm_delivery')}
          onPress={onConfirmDelivery}
          loading={isLoading}
          fullWidth
        />
      )}

    </View>
  );
}

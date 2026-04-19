import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Divider } from '@dawwar/ui';
import { space, typography } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

interface CashCollectionCardProps {
  deliveryFee: number;
  itemsCost?: number;   // for custom orders: driver paid from pocket
  commission?: number;
  isCustomOrder?: boolean;
}

export function CashCollectionCard({
  deliveryFee,
  itemsCost = 0,
  commission = 5,
  isCustomOrder = false,
}: CashCollectionCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const customerPays = isCustomOrder ? itemsCost + deliveryFee : deliveryFee;
  const driverNets = deliveryFee - commission;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text variant="h4" color={colors.text} style={styles.title}>
        {t('driver.cash_breakdown_title')}
      </Text>

      {isCustomOrder && (
        <View style={styles.row}>
          <Text variant="body2" color={colors.textSecondary}>{t('driver.items_cost')}</Text>
          <Text variant="label" color={colors.text}>{itemsCost} {t('common.egp')}</Text>
        </View>
      )}

      <View style={styles.row}>
        <Text variant="body2" color={colors.textSecondary}>{t('driver.delivery_fee')}</Text>
        <Text variant="label" color={colors.text}>{deliveryFee} {t('common.egp')}</Text>
      </View>

      <View style={styles.row}>
        <Text variant="body2" color={colors.textSecondary}>{t('driver.commission_label')}</Text>
        <Text variant="label" color={colors.error}>−{commission} {t('common.egp')}</Text>
      </View>

      <Divider style={{ marginVertical: space[2] }} />

      <View style={styles.row}>
        <Text variant="label" color={colors.text}>{t('driver.customer_pays')}</Text>
        <Text style={{ ...typography.h3, color: colors.text, fontWeight: '800' }}>
          {customerPays} {t('common.egp')}
        </Text>
      </View>

      <View style={[styles.row, styles.netRow, { backgroundColor: colors.successBg }]}>
        <Text variant="label" color={colors.success}>{t('driver.you_net')}</Text>
        <Text style={{ ...typography.h4, color: colors.success, fontWeight: '700' }}>
          {driverNets} {t('common.egp')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1, borderRadius: 16,
    padding: space.base, gap: space.sm,
    margin: space.base,
  },
  title: { marginBottom: space.sm },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netRow: {
    marginTop: space.sm, borderRadius: 10,
    padding: space.md,
  },
});

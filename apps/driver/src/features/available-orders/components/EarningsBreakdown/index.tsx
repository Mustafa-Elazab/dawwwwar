import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@dawwar/theme';
import { Text, Divider } from '@dawwar/ui';
import { space, typography } from '@dawwar/theme';
import { useTranslation } from '@dawwar/i18n';

interface EarningsBreakdownProps {
  deliveryFee: number;
  commission?: number;    // defaults to 5 EGP
}

export function EarningsBreakdown({ deliveryFee, commission = 5 }: EarningsBreakdownProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const net = deliveryFee - commission;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderRadius: 12 }]}>
      <View style={styles.row}>
        <Text variant="body2" color={colors.textSecondary}>{t('driver.delivery_fee')}</Text>
        <Text variant="label" color={colors.text}>{deliveryFee} {t('common.egp')}</Text>
      </View>
      <View style={styles.row}>
        <Text variant="body2" color={colors.textSecondary}>{t('driver.commission')}</Text>
        <Text variant="label" color={colors.error}>-{commission} {t('common.egp')}</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.row}>
        <Text variant="label" color={colors.text} style={{ fontWeight: '700' }}>{t('driver.you_net')}</Text>
        <Text variant="h4" color={colors.success}>{net} {t('common.egp')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.md, gap: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { marginVertical: space.sm },
});

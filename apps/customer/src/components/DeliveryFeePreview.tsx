import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useTheme, space, typography } from '@dawwar/theme';
import api from '../core/api/client';

interface Props {
  merchantId: string;
  latitude?: number;
  longitude?: number;
  subtotal: number;
}

export const DeliveryFeePreview = React.memo(({ merchantId, latitude, longitude, subtotal }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { data: feePreview, isLoading } = useQuery({
    queryKey: ['deliveryFee', merchantId, latitude, longitude, subtotal],
    queryFn: async () => {
      const { data } = await api.get('/orders/delivery-fee', {
        params: {
          merchantId,
          latitude,
          longitude,
          subtotal,
        },
      });
      return data;
    },
    enabled: !!merchantId && !!latitude && !!longitude,
    staleTime: 30_000,
  });

  if (isLoading || !feePreview) return null;

  return (
    <View style={styles.feeRow}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('checkout.delivery_title', 'Delivery Fee')}</Text>
      <View style={styles.right}>
        {feePreview.isFree ? (
          <Text style={[styles.freeText, { color: colors.success }]}>{t('checkout.free_delivery', 'Free Delivery')} 🎉</Text>
        ) : (
          <>
            <Text style={[styles.feeAmount, { color: colors.text }]}>{feePreview.fee} {t('common.egp', 'EGP')}</Text>
            <Text style={[styles.distance, { color: colors.textTertiary }]}>({feePreview.distanceKm.toFixed(1)} km)</Text>
          </>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space.sm,
  },
  label: {
    ...typography.body2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeAmount: {
    ...typography.body2,
    fontWeight: '700',
  },
  freeText: {
    ...typography.body2,
    fontWeight: '700',
  },
  distance: {
    ...typography.caption,
  },
});

import React from 'react';
import { View, Linking } from 'react-native';
import { ScrollScreenTemplate, ErrorState, Skeleton, Text } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { MerchantHeader } from '../../components/MerchantHeader';
import { MerchantTabBar } from '../../components/TabBar';
import { ProductRow } from '../../components/ProductRow';
import { CartBar } from '../../components/CartBar';
import { useController } from './useController';
import { createStyles } from './styles';
import { ALL_DAYS, formatHours } from '../../utils/hours';
import type { OpeningHours } from '@dawwar/types';

export function MerchantDetailScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  if (ctrl.isError) {
    return <ErrorState onRetry={ctrl.retry} />;
  }

  return (
    <>
      <ScrollScreenTemplate edges={['top']} backgroundColor={colors.background}>
        {ctrl.isLoading || !ctrl.merchant ? (
          <>
            <Skeleton width="100%" height={220} />
            <View style={{ padding: 16, gap: 12 }}>
              <Skeleton width="60%" height={24} />
              <Skeleton width="80%" height={16} />
            </View>
          </>
        ) : (
          <>
            <MerchantHeader merchant={ctrl.merchant} onBack={ctrl.handleBack} />
            <MerchantTabBar active={ctrl.activeTab} onChange={ctrl.setActiveTab} />

            {/* ── Menu Tab ──────────────────────────── */}
            {ctrl.activeTab === 'menu' && (
              <View>
                {ctrl.products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    quantity={ctrl.getProductQuantity(product.id)}
                    onAdd={() => ctrl.handleAddProduct(product)}
                    onRemove={() => ctrl.handleRemoveProduct(product.id)}
                  />
                ))}
                <View style={styles.bottomPad} />
              </View>
            )}

            {/* ── Info Tab ──────────────────────────── */}
            {ctrl.activeTab === 'info' && (
              <View style={styles.infoTab}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{ctrl.t('addresses.address_label')}</Text>
                  <Text style={styles.infoValue}>{ctrl.merchant.address}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{ctrl.t('merchant.hours')}</Text>
                  <View style={styles.hoursTable}>
                    {ALL_DAYS.map((day) => {
                      const h =
                        ctrl.merchant?.openingHours[day as keyof OpeningHours] ?? null;
                      return (
                        <View key={day} style={styles.hoursRow}>
                          <Text style={styles.infoLabel}>{day}</Text>
                          <Text style={styles.infoValue}>{formatHours(h)}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* ── Reviews Tab (Phase 2 placeholder) ── */}
            {ctrl.activeTab === 'reviews' && (
              <View style={styles.reviewsPlaceholder}>
                <Text variant="body2" color={colors.textSecondary}>
                  {ctrl.t('merchant.reviews_soon')}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollScreenTemplate>

      {/* Sticky cart bar — outside scroll so it stays fixed */}
      {ctrl.showCartBar && (
        <CartBar
          itemCount={ctrl.cartCount}
          total={ctrl.cartTotal}
          onPress={ctrl.handleCartBarPress}
        />
      )}
    </>
  );
}

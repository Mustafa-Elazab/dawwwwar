import React from 'react';
import { View, FlatList, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TabScreenTemplate, Header, Text, Badge, Button, EmptyState } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { space } from '@dawwar/theme';
import { OrderStatus, OrderType } from '@dawwar/types';
import { NewOrderModal } from '../../components/NewOrderModal';
import { useController } from './useController';
import type { Order } from '@dawwar/types';
import type { OrderTab } from './useController';

const TABS: { key: OrderTab; labelKey: string }[] = [
  { key: 'new', labelKey: 'merchant_app.tab_new' },
  { key: 'preparing', labelKey: 'merchant_app.tab_preparing' },
  { key: 'ready', labelKey: 'merchant_app.tab_ready' },
  { key: 'active', labelKey: 'merchant_app.tab_active' },
  { key: 'completed', labelKey: 'merchant_app.tab_completed' },
];

function OrderCard({ order, onMarkReady, t }: { order: Order; onMarkReady: (id: string) => void; t: (key: string) => string }) {
  const { colors } = useTheme();
  const isPreparing = order.status === OrderStatus.ACCEPTED;
  const isCustom = order.type === OrderType.CUSTOM;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text variant="label" color={colors.text}>{order.orderNumber}</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {isCustom && <Badge label={t('orders.custom_order')} variant="warning" size="sm" />}
          <Badge
            label={order.paymentMethod === 'CASH' ? t('driver.cash_payment') : t('driver.wallet_payment')}
            variant="neutral" size="sm"
          />
        </View>
      </View>
      <Text variant="body2" color={colors.textSecondary}>
        {order.items?.map((i) => `${i.quantity}× ${i.productName}`).join(', ') ?? order.itemsDescription}
      </Text>
      <View style={styles.cardFooter}>
        <Text variant="label" color={colors.primary}>{order.total} {t('common.egp')}</Text>
        {isPreparing && (
          <Button label={t('merchant_app.mark_ready')} onPress={() => onMarkReady(order.id)} size="sm" variant="outline" />
        )}
      </View>
    </View>
  );
}

export function MerchantOrdersScreen() {
  const { colors } = useTheme();
  const ctrl = useController();

  return (
    <TabScreenTemplate>
      <Header title={ctrl.t('orders.title')} />

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, ctrl.activeTab === tab.key && { borderBottomColor: colors.primary, borderBottomWidth: 2.5 }]}
            onPress={() => ctrl.setActiveTab(tab.key)}
          >
            <Text variant="label" color={ctrl.activeTab === tab.key ? colors.primary : colors.textSecondary}>
              {ctrl.t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Order list */}
      <FlatList<Order>
        data={ctrl.orders}
        renderItem={({ item }) => (
          <OrderCard order={item} onMarkReady={ctrl.handleMarkReady} t={ctrl.t} />
        )}
        keyExtractor={(item) => item.id}
        onRefresh={ctrl.refetch}
        refreshing={false}
        ListEmptyComponent={<EmptyState icon="clipboard-list-outline" title={ctrl.t('orders.empty_active')} />}
        contentContainerStyle={{ padding: space[2], flexGrow: 1 }}
        removeClippedSubviews
        windowSize={5}
        maxToRenderPerBatch={8}
        initialNumToRender={10}
      />

      {/* New order modal */}
      <NewOrderModal
        order={ctrl.pendingOrder}
        visible={ctrl.showModal}
        onAccept={ctrl.handleAccept}
        onReject={ctrl.handleReject}
        isAccepting={ctrl.isAccepting}
      />
    </TabScreenTemplate>
  );
}

const styles = StyleSheet.create({
  tabBar: { paddingHorizontal: space[2], borderBottomWidth: 1 },
  tab: { paddingHorizontal: space.md, paddingVertical: space.md },
  card: {
    margin: space[2], borderWidth: 1,
    borderRadius: 12, padding: space.md, gap: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
});

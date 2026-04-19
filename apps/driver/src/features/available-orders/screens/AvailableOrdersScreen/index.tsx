import React from 'react';
import { View, FlatList } from 'react-native';
import { TabScreenTemplate, Header, Text, EmptyState, Icon } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OnlineToggle } from '../../components/OnlineToggle';
import { OrderPreviewCard } from '../../components/OrderPreviewCard';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Order } from '@dawwar/types';

export function AvailableOrdersScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <TabScreenTemplate>
      <Header title={ctrl.t('app.title', { defaultValue: 'دوّار' })} />

      {/* Online/Offline toggle */}
      <OnlineToggle
        isOnline={ctrl.isOnline}
        onToggle={ctrl.handleToggleOnline}
      />

      {/* Orders list — only shown when online */}
      {ctrl.isOnline ? (
        ctrl.orders.length === 0 ? (
          <View style={styles.offlinePlaceholder}>
            <Icon name="clock-outline" size={48} color={colors.textDisabled} />
            <Text style={styles.offlineText}>{ctrl.t('driver.no_orders')}</Text>
            <Text variant="caption" color={colors.textDisabled}>
              {ctrl.t('driver.no_orders_sub')}
            </Text>
          </View>
        ) : (
          <FlatList<Order>
            data={ctrl.orders}
            renderItem={({ item }) => (
              <OrderPreviewCard
                order={item}
                onAccept={() => ctrl.handleAccept(item.id)}
                onDecline={() => ctrl.handleDecline(item.id)}
                isAccepting={ctrl.acceptingOrderId === item.id}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onRefresh={ctrl.refetch}
            refreshing={false}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            windowSize={5}
            maxToRenderPerBatch={8}
            initialNumToRender={10}
          />
        )
      ) : (
        <View style={styles.offlinePlaceholder}>
          <Icon name="motorbike-off" size={48} color={colors.textDisabled} />
          <Text style={styles.offlineText}>{ctrl.t('driver.offline_sub')}</Text>
        </View>
      )}
    </TabScreenTemplate>
  );
}

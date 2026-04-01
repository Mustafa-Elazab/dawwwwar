import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { ScreenTemplate, Header, Text, EmptyState, Skeleton } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OrderCard } from '../../components/OrderCard';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Order } from '@dawwar/types';

export function OrdersListScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  return (
    <ScreenTemplate
      edges={['top']}
      header={<Header title={ctrl.t('orders.title')} />}
    >
      {/* Tab switcher */}
      <View style={styles.tabRow}>
        {(['active', 'past'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, ctrl.activeTab === tab && styles.tabActive]}
            onPress={() => ctrl.setActiveTab(tab)}
          >
            <Text
              style={styles.tabLabel}
              color={ctrl.activeTab === tab ? colors.primary : colors.textSecondary}
            >
              {ctrl.t(`orders.tab_${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {ctrl.isLoading ? (
        <View style={{ gap: 12, paddingTop: 8 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="92%" height={120} style={{ alignSelf: 'center', borderRadius: 16 }} />
          ))}
        </View>
      ) : ctrl.orders.length === 0 ? (
        <EmptyState
          icon="clipboard-list-outline"
          title={ctrl.t(`orders.empty_${ctrl.activeTab}`)}
          subtitle={ctrl.t(`orders.empty_${ctrl.activeTab}_sub`)}
        />
      ) : (
        <FlatList<Order>
          data={ctrl.orders}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onTrack={() => ctrl.handleTrack(item.id)}
              onViewDetail={() => ctrl.handleDetail(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          onRefresh={ctrl.refetch}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        />
      )}
    </ScreenTemplate>
  );
}

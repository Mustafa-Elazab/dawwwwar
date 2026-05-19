import React, { useMemo } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, EmptyState, Skeleton } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { OrderCard } from '../../components/OrderCard';
import { useController } from './useController';
import { createStyles } from './styles';
import type { Order } from '@dawwar/types';

export function OrdersListScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const ctrl = useController();

  const renderItem = React.useCallback(({ item }: { item: Order }) => (
    <OrderCard
      order={item}
      onTrack={() => ctrl.handleTrack(item.id)}
      onViewDetail={() => ctrl.handleDetail(item.id)}
    />
  ), [ctrl.handleTrack, ctrl.handleDetail]);

  return (
    <ScreenTemplate
      headerProps={{ 
        title: t('orders.title'),
        type: 'none'
      }}
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
              style={[
                styles.tabLabel,
                { fontWeight: ctrl.activeTab === tab ? '700' : '400' }
              ]}
              color={ctrl.activeTab === tab ? '#fff' : colors.textSecondary}
            >
              {t(`orders.tab_${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {!ctrl.isAuthenticated ? (
        <EmptyState
          icon="account-lock-outline"
          title={t('gate.ordersTitle')}
          subtitle={t('gate.ordersSubtitle')}
          actionLabel={t('gate.loginToViewOrders')}
          onAction={ctrl.handleLogin}
        />
      ) : ctrl.isLoading ? (
        <View style={{ gap: 12, paddingTop: 8 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width="92%" height={120} style={{ alignSelf: 'center', borderRadius: 16 }} />
          ))}
        </View>
      ) : ctrl.orders.length === 0 ? (
        <EmptyState
          icon="clipboard-list-outline"
          title={t(`orders.empty_${ctrl.activeTab}`)}
          subtitle={t(`orders.empty_${ctrl.activeTab}_sub`)}
        />
      ) : (
        <FlatList<Order>
          data={ctrl.orders}
          renderItem={renderItem}
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

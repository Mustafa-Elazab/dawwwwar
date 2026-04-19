import React from 'react';
import { View, FlatList } from 'react-native';
import { TabScreenTemplate, Header, Text, LoadingSpinner } from '@dawwar/ui';
import { useTheme } from '@dawwar/theme';
import { EarningsSummaryCard } from '../../components/EarningsSummaryCard';
import { WeeklyChart } from '../../components/WeeklyChart';
import { DeliveryHistoryItem } from '../../components/DeliveryHistoryItem';
import { useController } from './useController';
import { createStyles } from './styles';
import type { WalletTransaction } from '@dawwar/types';

export function EarningsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const ctrl = useController();

  if (ctrl.isLoading || !ctrl.summary) return <LoadingSpinner fullscreen />;

  return (
    <TabScreenTemplate>
      <FlatList<WalletTransaction>
        ListHeaderComponent={
          <>
            <Header title={ctrl.t('driver.today_earnings')} />
            <EarningsSummaryCard
              summary={ctrl.summary}
              walletBalance={ctrl.balance}
            />
            <WeeklyChart data={ctrl.summary.weeklyData} />
            <Text style={styles.sectionTitle}>{ctrl.t('wallet.history_title')}</Text>
          </>
        }
        data={ctrl.transactions}
        renderItem={({ item }) => <DeliveryHistoryItem transaction={item} />}
        keyExtractor={(item) => item.id}
        onRefresh={ctrl.refetch}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text variant="body2" color={colors.textSecondary}>
              {ctrl.t('wallet.empty_history')}
            </Text>
          </View>
        }
      />
    </TabScreenTemplate>
  );
}

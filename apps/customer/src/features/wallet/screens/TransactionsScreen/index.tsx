import React from 'react';
import { View, SectionList, StyleSheet, I18nManager } from 'react-native';
import { useTranslation } from '@dawwar/i18n';
import { ScreenTemplate, Text, LoadingSpinner, ErrorState, EmptyState } from '@dawwar/ui';
import { useTheme, space, typography } from '@dawwar/theme';
import { TransactionItem } from '../../components/TransactionItem';
import { useController } from './useController';

export function TransactionsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const ctrl = useController();

  const renderItem = React.useCallback(({ item }: any) => <TransactionItem transaction={item} />, []);
  
  const renderSectionHeader = React.useCallback(({ section: { title } }: any) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.surfaceVariant }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  ), [colors.surfaceVariant, colors.textSecondary]);

  if (ctrl.isLoading) return <LoadingSpinner fullscreen />;
  if (ctrl.isError) return <ErrorState onRetry={ctrl.refetch} />;

  return (
    <ScreenTemplate
      headerProps={{ 
        title: t('wallet.history_title'),
        onBackPress: ctrl.handleBack,
      }}
      edges={['top']}
      backgroundColor={colors.background}
    >
      <SectionList
        sections={ctrl.sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
        onRefresh={ctrl.refetch}
        refreshing={false}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title={t('wallet.empty_history')}
            subtitle={t('wallet.empty_history_sub')}
          />
        }
      />
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: space.xl,
  },
  sectionHeader: {
    paddingHorizontal: space.base,
    paddingVertical: space.xs,
  },
  sectionTitle: {
    ...typography.label,
    fontWeight: '800',
    textAlign: 'auto',
  },
});

import { useMemo } from 'react';
import { useTranslation } from '@dawwar/i18n';
import { useNavigation } from '@react-navigation/native';
import { useTransactions } from '../../core/hooks';
import type { WalletTransaction } from '@dawwar/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<WalletStackParamList>>();
  const { data: transactions, isLoading, isError, refetch } = useTransactions();

  const groupedTransactions = useMemo(() => {
    if (!transactions) return [];
    const groups: Record<string, WalletTransaction[]> = {};
    
    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let title = date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
      
      if (date.toDateString() === today.toDateString()) {
        title = t('common.today');
      } else if (date.toDateString() === yesterday.toDateString()) {
        title = t('common.yesterday');
      }

      if (!groups[title]) {
        groups[title] = [];
      }
      groups[title].push(tx);
    });

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  }, [transactions, t]);

  return {
    transactions: transactions ?? [],
    sections: groupedTransactions,
    isLoading,
    isError,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

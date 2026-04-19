import { useTranslation } from '@dawwar/i18n';
import { useEarningsSummary, useDriverTransactions, useDriverWalletBalance } from '../../core/hooks';

export function useController() {
  const { t } = useTranslation();
  const { data: summary, isLoading: summaryLoading, refetch: refetchSummary } = useEarningsSummary();
  const { data: transactions, isLoading: txLoading } = useDriverTransactions();
  const { data: balance } = useDriverWalletBalance();

  return {
    summary,
    transactions: transactions ?? [],
    balance: balance ?? 0,
    isLoading: summaryLoading || txLoading,
    refetch: refetchSummary,
    t,
  };
}

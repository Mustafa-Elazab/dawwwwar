import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useTransactions, useWallet } from '../../core/hooks';
import { WALLET_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<WalletStackParamList>>();
  const { data: wallet, isLoading, isError, refetch } = useWallet();
  const { data: transactions } = useTransactions();

  const recentTransactions = (transactions ?? []).slice(0, 3);

  return {
    wallet,
    isLoading,
    isError,
    balance: wallet?.balance ?? 0,
    recentTransactions,
    handleViewTransactions: () => navigation.navigate(WALLET_ROUTES.TRANSACTIONS),
    refetch,
    t,
  };
}

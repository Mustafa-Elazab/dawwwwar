import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useWallet } from '../../core/hooks';
import { WALLET_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { WalletStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<WalletStackParamList>>();
  const { data: wallet, isLoading, isError, refetch } = useWallet();

  return {
    wallet,
    isLoading,
    isError,
    balance: wallet?.balance ?? 0,
    handleViewTransactions: () => navigation.navigate(WALLET_ROUTES.TRANSACTIONS),
    refetch,
    t,
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useWallet() {
  const { wallet } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.wallet.balance,
    queryFn: () => wallet.getWallet(),
  });
}

export function useWalletTransactions() {
  const { wallet } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.wallet.transactions,
    queryFn: () => wallet.getTransactions(),
  });
}

export function useRechargeWallet() {
  const { wallet } = useApiClient();
  return useMutation({
    mutationFn: (amount: number) => wallet.recharge(amount),
  });
}

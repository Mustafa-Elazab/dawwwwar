import { useQuery } from '@tanstack/react-query';
import { earningsApi } from './api';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';

export const EARNINGS_KEYS = {
  summary: (id: string) => ['earnings', 'summary', id] as const,
  transactions: (id: string) => ['earnings', 'transactions', id] as const,
  balance: (id: string) => ['earnings', 'balance', id] as const,
};

export function useEarningsSummary() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: EARNINGS_KEYS.summary(user?.id ?? ''),
    queryFn: () => earningsApi.getSummary(user?.id ?? ''),
    enabled: !!user?.id,
    staleTime: 60_000,
  });
}

export function useDriverTransactions() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: EARNINGS_KEYS.transactions(user?.id ?? ''),
    queryFn: () => earningsApi.getTransactions(user?.id ?? ''),
    enabled: !!user?.id,
    staleTime: 60_000,
  });
}

export function useDriverWalletBalance() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: EARNINGS_KEYS.balance(user?.id ?? ''),
    queryFn: () => earningsApi.getWalletBalance(user?.id ?? ''),
    enabled: !!user?.id,
    staleTime: 30_000,
  });
}

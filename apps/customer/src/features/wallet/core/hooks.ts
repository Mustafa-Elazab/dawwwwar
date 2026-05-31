import { useQuery, useMutation } from '@tanstack/react-query';
import { walletApi } from './api';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/auth.slice';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';

const unwrap = <T,>(res: T | { data: T }): T =>
  res && typeof res === 'object' && 'data' in res ? res.data : (res as T);

export const WALLET_KEYS = {
  wallet: (id: string) => ['wallet', id] as const,
  transactions: (id: string) => ['wallet', id, 'transactions'] as const,
};

export function useWallet() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: WALLET_KEYS.wallet(user?.id ?? ''),
    queryFn: () => walletApi.getWallet(),
    enabled: !!user?.id,
    staleTime: 30_000,
    select: (res) => unwrap(res),
  });
}

export function useTransactions() {
  const user = useAppSelector(selectUser);
  return useQuery({
    queryKey: WALLET_KEYS.transactions(user?.id ?? ''),
    queryFn: () => walletApi.getTransactions(),
    enabled: !!user?.id,
    staleTime: 60_000,
    select: (res) => unwrap(res),
  });
}

export function useRecharge() {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (amount: number) => walletApi.requestRecharge(amount),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: t('wallet.recharge_submitted') });
    },
    onError: () => {
      Toast.show({ type: 'error', text1: t('errors.server') });
    },
  });
}

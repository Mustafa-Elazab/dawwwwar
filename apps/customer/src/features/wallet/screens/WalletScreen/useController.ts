import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import Toast from 'react-native-toast-message';
import { SOCKET_EVENTS } from '@dawwar/api-client';
import { walletApi } from '../../core/api';
import type { WalletRechargeResponse } from '../../core/api';
import { useWallet, WALLET_KEYS } from '../../core/hooks';
import { PAYMENT_ROUTES, WALLET_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList, RootParamList, WalletStackParamList } from '../../../../navigation/types';
import { socketManager } from '../../../../core/socket';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';

type WalletNavigation = StackNavigationProp<
  WalletStackParamList & ProfileStackParamList & RootParamList
>;

const unwrapRecharge = (
  res: WalletRechargeResponse | { data: WalletRechargeResponse },
) => (res && typeof res === 'object' && 'data' in res ? res.data : res);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error !== 'object' || error === null || !('response' in error)) {
    return fallback;
  }

  const response = (error as { response?: { data?: { message?: unknown } } }).response;
  return typeof response?.data?.message === 'string'
    ? response.data.message
    : fallback;
};

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<WalletNavigation>();
  const queryClient = useQueryClient();
  const user = useAppSelector(selectUser);
  const { data: wallet, isLoading, isError, refetch } = useWallet();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [rechargeError, setRechargeError] = useState<string | null>(null);

  const effectiveAmount = useMemo(() => {
    if (showCustomInput) {
      const parsed = Number(customAmount);
      return Number.isFinite(parsed) && parsed >= 10 ? parsed : null;
    }
    return selectedAmount;
  }, [customAmount, selectedAmount, showCustomInput]);

  const rechargeMutation = useMutation({
    mutationFn: (amount: number) => walletApi.requestRecharge(amount),
    onSuccess: (response) => {
      const data = unwrapRecharge(response);
      if (!data.checkoutUrl) {
        setRechargeError(t('wallet.payment_error'));
        return;
      }

      setRechargeError(null);
      navigation.navigate(PAYMENT_ROUTES.PAYMENT_WEBVIEW, {
        url: data.checkoutUrl,
        title: t('wallet.rechargeTitle'),
      });
    },
    onError: (error) => {
      setRechargeError(getErrorMessage(error, t('common.error_body')));
    },
  });

  useEffect(() => {
    if (!user?.id) return undefined;

    socketManager.connect();

    const handleWalletRecharged = (payload: { amount?: number }) => {
      void queryClient.invalidateQueries({ queryKey: WALLET_KEYS.wallet(user.id) });
      Toast.show({
        type: 'success',
        text1: t('wallet.rechargeSuccess'),
        text2: t('wallet.rechargeAmount', { amount: payload.amount ?? 0 }),
      });
    };

    socketManager.on(SOCKET_EVENTS.WALLET_RECHARGED, handleWalletRecharged);
    return () => {
      socketManager.off(SOCKET_EVENTS.WALLET_RECHARGED, handleWalletRecharged);
    };
  }, [queryClient, t, user?.id]);

  const handleAmountSelect = useCallback((amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowCustomInput(false);
    setRechargeError(null);
  }, []);

  const handleCustomAmountSelect = useCallback(() => {
    setSelectedAmount(null);
    setShowCustomInput(true);
    setRechargeError(null);
  }, []);

  const handleRecharge = useCallback(() => {
    if (!effectiveAmount) {
      setRechargeError(t('wallet.minAmount'));
      return;
    }
    rechargeMutation.mutate(effectiveAmount);
  }, [effectiveAmount, rechargeMutation, t]);

  return {
    wallet,
    isLoading,
    isError,
    balance: wallet?.balance ?? 0,
    selectedAmount,
    customAmount,
    showCustomInput,
    effectiveAmount,
    rechargeError,
    isRecharging: rechargeMutation.isPending,
    handleAmountSelect,
    handleCustomAmountSelect,
    handleCustomAmountChange: setCustomAmount,
    handleRecharge,
    handleViewTransactions: () => navigation.navigate(WALLET_ROUTES.TRANSACTIONS),
    refetch,
    t,
  };
}

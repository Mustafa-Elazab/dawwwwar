import { useMemo } from 'react';
import { useTranslation } from '@dawwar/i18n';
import { useNavigation } from '@react-navigation/native';
import { useMyOrders } from '@dawwar/api-client';
import type { Order } from '@dawwar/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  // Re-using useMyOrders for now, but in a real app we might need useDriverOrders
  const { data: res, isLoading, isError, refetch } = useMyOrders('completed');

  return {
    orders: res?.data ?? [],
    isLoading,
    isError,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

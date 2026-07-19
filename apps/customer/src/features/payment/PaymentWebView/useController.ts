import { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useTranslation } from '@dawwar/i18n';
import { PAYMENT_ROUTES } from '../../../navigation/routes';
import type { RootParamList } from '../../../navigation/types';

export type PaymentWebViewNavigationState = {
  url: string;
  loading?: boolean;
};

export function useController() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigation = useNavigation<StackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList, typeof PAYMENT_ROUTES.PAYMENT_WEBVIEW>>();
  const [isLoading, setIsLoading] = useState(true);

  const { url, title, onSuccess } = route.params;

  const handleNavigationChange = useCallback((navState: PaymentWebViewNavigationState) => {
    setIsLoading(!!navState.loading);

    const currentUrl = navState.url.toLowerCase();
    const isSuccess =
      currentUrl.includes('success=true') ||
      currentUrl.includes('is_success=true') ||
      currentUrl.includes('/success') ||
      currentUrl.includes('callback');
    const isFailure =
      currentUrl.includes('success=false') ||
      currentUrl.includes('is_success=false') ||
      currentUrl.includes('/failure') ||
      currentUrl.includes('error');

    if (isSuccess) {
      void queryClient.invalidateQueries({ queryKey: ['wallet'] });
      Toast.show({ type: 'success', text1: t('wallet.rechargeSuccess') });
      onSuccess?.();
      navigation.goBack();
      return;
    }

    if (isFailure) {
      Toast.show({ type: 'error', text1: t('wallet.payment_error') });
      navigation.goBack();
    }
  }, [navigation, onSuccess, queryClient, t]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    url,
    title,
    isLoading,
    handleNavigationChange,
    handleClose,
  };
}

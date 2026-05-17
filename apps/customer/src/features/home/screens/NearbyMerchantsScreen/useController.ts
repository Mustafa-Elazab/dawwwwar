import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectLocation } from '../../../../store/slices/location.slice';
import { useNearbyMerchants } from '../../core/hooks';
import { HOME_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../../../../navigation/types';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const location = useAppSelector(selectLocation);
  
  const {
    data: merchants,
    isLoading,
    isError,
    refetch,
  } = useNearbyMerchants(location.latitude ?? undefined, location.longitude ?? undefined);

  const handleMerchantPress = useCallback(
    (merchantId: string) => {
      navigation.navigate(HOME_ROUTES.MERCHANT_DETAIL, { merchantId });
    },
    [navigation],
  );

  return {
    merchants: merchants ?? [],
    isLoading,
    isError,
    handleMerchantPress,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@dawwar/i18n';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { profileApi } from '../../core/api';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';
import Toast from 'react-native-toast-message';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();

  const { data: addresses, isLoading, isError, refetch } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => profileApi.getAddresses(user?.id ?? ''),
    enabled: !!user?.id,
    select: (res) => res.data,
  });

  const deleteMutation = useMutation({
    mutationFn: profileApi.deleteAddress,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
      Toast.show({ type: 'success', text1: t('addresses.deleted') });
    },
  });

  return {
    addresses: addresses ?? [],
    isLoading,
    isError,
    handleAddNew: () => navigation.navigate(PROFILE_ROUTES.ADD_ADDRESS, {}),
    handleEdit: (id: string) => navigation.navigate(PROFILE_ROUTES.ADD_ADDRESS, { editId: id }),
    handleDelete: (id: string) => deleteMutation.mutate(id),
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

import { useAddresses, useDeleteAddress, QUERY_KEYS } from '@dawwar/api-client';
import { useTranslation } from '@dawwar/i18n';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/auth.slice';
import { PROFILE_ROUTES } from '../../../../navigation/routes';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ProfileStackParamList } from '../../../../navigation/types';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';

export function useController() {
  const { t } = useTranslation();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList>>();
  const user = useAppSelector(selectUser);
  const queryClient = useQueryClient();

  const { data: res, isLoading, isError, refetch } = useAddresses(user?.id);
  const addresses = res?.data;

  const deleteMutation = useDeleteAddress();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile.addresses(user?.id ?? '') });
        Toast.show({ type: 'success', text1: t('addresses.deleted') });
      },
    });
  };

  return {
    addresses: addresses ?? [],
    isLoading,
    isError,
    handleAddNew: () => navigation.navigate(PROFILE_ROUTES.ADD_ADDRESS, {}),
    handleEdit: (id: string) => navigation.navigate(PROFILE_ROUTES.ADD_ADDRESS, { editId: id }),
    handleDelete,
    handleBack: () => navigation.goBack(),
    refetch,
    t,
  };
}

import { useMutation, useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';
import { Address, User } from '@dawwar/types';

export function useAddresses(userId?: string) {
  const { profile } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.profile.addresses(userId || ''),
    queryFn: () => profile.getAddresses(userId || ''),
    enabled: !!userId,
  });
}

export function useSaveAddress() {
  const { profile } = useApiClient();
  return useMutation({
    mutationFn: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) =>
      profile.saveAddress(address),
  });
}

export function useDeleteAddress() {
  const { profile } = useApiClient();
  return useMutation({
    mutationFn: (id: string) => profile.deleteAddress(id),
  });
}

export function useUpdateProfile() {
  const { profile } = useApiClient();
  return useMutation({
    mutationFn: (updates: Partial<User>) => profile.updateProfile(updates),
  });
}

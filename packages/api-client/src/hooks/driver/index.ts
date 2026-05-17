import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useDriverProfile() {
  const { driver } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.driver.profile,
    queryFn: () => driver.getProfile(),
  });
}

export function useToggleOnline() {
  const { driver } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isOnline: boolean) => driver.toggleOnline(isOnline),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.driver.profile });
    },
  });
}

export function useUpdateDriverAvailability() {
  const { driver } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isOnline: boolean) => driver.updateAvailability(isOnline),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.driver.profile });
    },
  });
}

export function useUpdateDriverLocation() {
  const { driver } = useApiClient();
  return useMutation({
    mutationFn: (payload: { latitude: number; longitude: number; heading?: number }) =>
      driver.updateLocation(payload),
  });
}

export function useDriverEarnings() {
  const { driver } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.driver.earnings,
    queryFn: () => driver.getEarnings(),
  });
}

export function useDriverWalletBalance() {
  const { driver } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.driver.wallet,
    queryFn: () => driver.getWalletBalance(),
  });
}

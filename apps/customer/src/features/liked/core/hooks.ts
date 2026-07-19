import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { likedApi } from './api';
import { useAppSelector } from '../../../store/hooks';
import { selectIsAuthenticated, selectUser } from '../../../store/slices/auth.slice';

export const LIKED_KEYS = {
  all: ['liked'] as const,
  byUser: (userId: string) => ['liked', userId] as const,
};

export function useLikedProducts() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userId = useAppSelector(selectUser)?.id;

  return useQuery({
    queryKey: userId ? LIKED_KEYS.byUser(userId) : LIKED_KEYS.all,
    queryFn: likedApi.getFavorites,
    enabled: isAuthenticated && Boolean(userId),
    staleTime: 60_000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, liked }: { productId: string; liked: boolean }) => {
      if (liked) {
        await likedApi.removeFavorite(productId);
        return null;
      }
      return likedApi.addFavorite(productId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LIKED_KEYS.all });
    },
  });
}

export const useLikedMerchants = useLikedProducts;

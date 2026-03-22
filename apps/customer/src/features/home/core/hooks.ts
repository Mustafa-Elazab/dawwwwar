import { useQuery } from '@tanstack/react-query';
import { homeApi } from './api';

export const HOME_KEYS = {
  nearbyMerchants: ['home', 'nearby'] as const,
  featuredProducts: ['home', 'featured'] as const,
};

export function useNearbyMerchants() {
  return useQuery({
    queryKey: HOME_KEYS.nearbyMerchants,
    queryFn: homeApi.getNearbyMerchants,
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: HOME_KEYS.featuredProducts,
    queryFn: homeApi.getFeaturedProducts,
    staleTime: 120_000,
    select: (res) => res.data,
  });
}

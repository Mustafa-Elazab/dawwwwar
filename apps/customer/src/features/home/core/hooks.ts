import { useQuery } from '@tanstack/react-query';
import { homeApi } from './api';
import type { Category } from '@dawwar/types';

export const HOME_KEYS = {
  nearbyMerchants: ['home', 'nearby'] as const,
  featuredProducts: ['home', 'featured'] as const,
  categories: ['home', 'categories'] as const,
};

export function useNearbyMerchants(lat?: number, lng?: number) {
  return useQuery({
    queryKey: [...HOME_KEYS.nearbyMerchants, lat, lng],
    queryFn: () => homeApi.getNearbyMerchants(lat, lng),
    staleTime: 60_000,
    select: (res) => res.data,
  });
}

export function useFeaturedProducts(lat?: number, lng?: number) {
  return useQuery({
    queryKey: [...HOME_KEYS.featuredProducts, lat, lng],
    queryFn: () => homeApi.getFeaturedProducts(lat, lng),
    staleTime: 120_000,
    select: (res) => res.data,
  });
}

export function useHomeCategories() {
  return useQuery({
    queryKey: HOME_KEYS.categories,
    queryFn: homeApi.getCategories,
    staleTime: 10 * 60_000,
    select: (res) =>
      [...res.data]
        .filter((c: Category) => c.isActive)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  });
}

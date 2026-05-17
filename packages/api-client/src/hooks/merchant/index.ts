import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';
import { NearbyFilter } from '../../services/merchant.service';
import { CreateMerchantDto, UpdateMerchantDto } from '../../types/merchant.types';
import { CreateProductDto, UpdateProductDto } from '../../types/product.types';

export function useNearbyMerchants(filter: NearbyFilter) {
  const { merchant } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.merchants.nearby(filter.latitude || 0, filter.longitude || 0),
    queryFn: () => merchant.getNearby(filter),
  });
}

export function useMerchantDetails(id: string) {
  const { merchant } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.merchants.detail(id),
    queryFn: () => merchant.getById(id),
    enabled: !!id,
  });
}

export function useMyMerchant() {
  const { merchant } = useApiClient();
  return useQuery({
    queryKey: ['merchants', 'my'],
    queryFn: () => merchant.getMyMerchant(),
  });
}

export function useMerchantProducts(id: string) {
  const { merchant } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.merchants.products(id),
    queryFn: () => merchant.getProducts(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  const { merchant } = useApiClient();
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => merchant.getFeaturedProducts(),
  });
}

export function useCreateMerchant() {
  const { merchant } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateMerchantDto) => merchant.createMerchant(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['merchants', 'my'] });
    },
  });
}

export function useUpdateMerchant() {
  const { merchant } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateMerchantDto }) =>
      merchant.updateMerchant(id, updates),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.merchants.detail(variables.id) });
      void queryClient.invalidateQueries({ queryKey: ['merchants', 'my'] });
    },
  });
}

export function useCreateProduct() {
  const { merchant } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateProductDto) => merchant.createProduct(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] }); // Broad invalidation for simplicity
    },
  });
}

export function useUpdateProduct() {
  const { merchant } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProductDto }) =>
      merchant.updateProduct(id, updates),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { merchant } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => merchant.deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

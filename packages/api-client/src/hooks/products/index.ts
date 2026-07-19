import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useProductDetails(productId?: string) {
  const { products } = useApiClient();
  return useQuery({
    queryKey: productId ? QUERY_KEYS.products.detail(productId) : QUERY_KEYS.products.detail(''),
    queryFn: () => products.getById(productId ?? ''),
    enabled: !!productId,
  });
}

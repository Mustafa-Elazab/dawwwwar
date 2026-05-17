import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';

export function useCategories() {
  const { categories } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: () => categories.findAll(),
  });
}

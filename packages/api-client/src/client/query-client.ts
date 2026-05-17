import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          if (error?.response?.status === 404) return false;
          return failureCount < 3;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
};

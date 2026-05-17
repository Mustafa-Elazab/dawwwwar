import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../client/provider';
import { QUERY_KEYS } from '../../constants/query-keys';
import { ChatMessage } from '../../services/chat.service';

export function useChatMessages(orderId: string) {
  const { chat } = useApiClient();
  return useQuery({
    queryKey: QUERY_KEYS.chat.messages(orderId),
    queryFn: () => chat.getMessages(orderId),
    enabled: !!orderId,
    refetchOnWindowFocus: false,
  });
}

export function useMarkChatAsRead() {
  const { chat } = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => chat.markAsRead(orderId),
    onSuccess: (_, orderId) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.chat.messages(orderId) });
    },
  });
}

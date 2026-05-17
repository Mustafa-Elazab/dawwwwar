import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketManager } from '../../realtime/socket-manager';
import { QUERY_KEYS } from '../../constants/query-keys';
import { useChatMessages, useMarkChatAsRead } from './index';
import { ChatMessage, MessageType } from '../../services/chat.service';
import { User } from '@dawwar/types';

export interface OptimisticMessage extends Partial<ChatMessage> {
  isOptimistic: boolean;
  status: 'sending' | 'sent' | 'error';
}

export function useChat(orderId: string, currentUser: User | null) {
  const queryClient = useQueryClient();
  const [optimisticMessages, setOptimisticMessages] = useState<OptimisticMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: historyRes, isLoading } = useChatMessages(orderId);
  const history = historyRes?.data || [];
  
  const markRead = useMarkChatAsRead();

  // 1. Socket Setup
  useEffect(() => {
    if (!orderId) return;

    // Join the specific order chat room
    socketManager.emit('CHAT_JOIN_CONVERSATION', { orderId });

    const handleNewMessage = (message: ChatMessage) => {
      // Remove from optimistic if it matches clientMessageId
      setOptimisticMessages((prev) => 
        prev.filter((m) => m.clientMessageId !== message.clientMessageId)
      );

      // Update React Query cache
      queryClient.setQueryData(QUERY_KEYS.chat.messages(orderId), (old: any) => {
        if (!old?.data) return { data: [message] };
        // Avoid duplicates
        if (old.data.find((m: ChatMessage) => m.id === message.id)) return old;
        return { ...old, data: [message, ...old.data] };
      });

      // Mark as read if I'm the receiver
      if (currentUser && message.senderId !== currentUser.id) {
        markRead.mutate(orderId);
      }
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (currentUser && data.userId !== currentUser.id) {
        setIsTyping(data.isTyping);
      }
    };

    socketManager.on('CHAT_NEW_MESSAGE', handleNewMessage);
    socketManager.on('CHAT_USER_TYPING', handleTyping);

    return () => {
      socketManager.off('CHAT_NEW_MESSAGE', handleNewMessage);
      socketManager.off('CHAT_USER_TYPING', handleTyping);
    };
  }, [orderId, currentUser, queryClient, markRead]);

  // 2. Send Message (Optimistic)
  const sendMessage = useCallback(async (content: string, type: MessageType = MessageType.TEXT, mediaUrl?: string) => {
    if (!currentUser || !orderId) return;

    const clientMessageId = Math.random().toString(36).substring(7);
    
    const newMessage: OptimisticMessage = {
      clientMessageId,
      content,
      type,
      mediaUrl,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      status: 'sending',
    };

    // Add to optimistic UI
    setOptimisticMessages((prev) => [newMessage, ...prev]);

    // Emit via socket
    socketManager.emit('CHAT_SEND_MESSAGE', {
      orderId,
      type,
      content,
      mediaUrl,
      clientMessageId,
    });

    // In a production app, we would handle socket ACKs to update status to 'sent' or 'error'
  }, [orderId, currentUser]);

  // 3. Typing Indicators
  const sendTypingStatus = useCallback((isTypingNow: boolean) => {
    socketManager.emit(isTypingNow ? 'CHAT_TYPING_START' : 'CHAT_TYPING_STOP', { orderId });
  }, [orderId]);

  const handleInputChange = useCallback(() => {
    sendTypingStatus(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 2000);
  }, [sendTypingStatus]);

  // Merge history + optimistic
  const messages = [...optimisticMessages, ...history];

  return {
    messages,
    isLoading,
    isTyping,
    sendMessage,
    handleInputChange,
  };
}

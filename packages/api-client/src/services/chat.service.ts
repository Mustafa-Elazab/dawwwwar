import { AxiosInstance } from 'axios';
import { ApiResponse } from '@dawwar/types';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  type: MessageType;
  content?: string;
  mediaUrl?: string;
  clientMessageId: string;
  sequenceNumber: number;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  orderId: string;
  status: 'ACTIVE' | 'CLOSED';
  lastMessageAt?: string;
}

export class ChatService {
  constructor(private client: AxiosInstance) {}

  async getMessages(orderId: string): Promise<ApiResponse<ChatMessage[]>> {
    const { data } = await this.client.get(`/chat/${orderId}`);
    return data;
  }

  async markAsRead(orderId: string): Promise<ApiResponse<void>> {
    const { data } = await this.client.post(`/chat/${orderId}/read`);
    return data;
  }
}

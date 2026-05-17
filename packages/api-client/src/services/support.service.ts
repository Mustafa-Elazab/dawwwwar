import { AxiosInstance } from 'axios';
import { ApiResponse } from '@dawwar/types';

export enum TicketType {
  WRONG_ITEM = 'WRONG_ITEM',
  MISSING_ITEM = 'MISSING_ITEM',
  DAMAGED_ITEM = 'DAMAGED_ITEM',
  DRIVER_NO_SHOW = 'DRIVER_NO_SHOW',
  CUSTOMER_NO_SHOW = 'CUSTOMER_NO_SHOW',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  PAYOUT_ISSUE = 'PAYOUT_ISSUE',
  CHAT_ABUSE = 'CHAT_ABUSE',
  ACCOUNT_BAN_APPEAL = 'ACCOUNT_BAN_APPEAL',
  GENERAL = 'GENERAL',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export interface SupportTicket {
  id: string;
  orderId?: string;
  order?: any; // Added order relation
  customerId: string;
  type: TicketType;
  status: TicketStatus;
  priority: string;
  createdAt: string;
  customer?: any;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderRole: string;
  content: string;
  mediaUrl?: string;
  isInternal: boolean;
  type: string;
  createdAt: string;
}

export class SupportService {
  constructor(private client: AxiosInstance) {}

  async createTicket(payload: any): Promise<ApiResponse<SupportTicket>> {
    const { data } = await this.client.post('/support/tickets', payload);
    return data;
  }

  async getMyTickets(): Promise<ApiResponse<SupportTicket[]>> {
    const { data } = await this.client.get('/support/tickets/my');
    return data;
  }

  async getTicketDetails(id: string): Promise<ApiResponse<SupportTicket>> {
    const { data } = await this.client.get(`/support/tickets/${id}`);
    return data;
  }

  async addMessage(id: string, payload: any): Promise<ApiResponse<TicketMessage>> {
    const { data } = await this.client.post(`/support/tickets/${id}/messages`, payload);
    return data;
  }

  // ── Admin Actions ──────────────────────────────────────────────────

  async adminGetAll(status?: string): Promise<ApiResponse<SupportTicket[]>> {
    const { data } = await this.client.get('/admin/support/tickets', { params: { status } });
    return data;
  }

  async adminResolve(id: string, payload: any): Promise<ApiResponse<SupportTicket>> {
    const { data } = await this.client.patch(`/admin/support/tickets/${id}/resolve`, payload);
    return data;
  }
}

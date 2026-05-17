import { AxiosInstance } from 'axios';
import { ApiResponse, PayoutRequest, PayoutStatus, PayoutMethod } from '@dawwar/types';

export interface RequestPayoutDto {
  amount: number;
  method: PayoutMethod;
}

export class PayoutService {
  constructor(private client: AxiosInstance) {}

  async requestPayout(payload: RequestPayoutDto): Promise<ApiResponse<PayoutRequest>> {
    const { data } = await this.client.post('/payouts/request', payload);
    return data;
  }

  async getMyPayouts(): Promise<ApiResponse<PayoutRequest[]>> {
    const { data } = await this.client.get('/payouts/my');
    return data;
  }

  // ── Admin Actions ──────────────────────────────────────────────────

  async adminGetAll(): Promise<ApiResponse<PayoutRequest[]>> {
    const { data } = await this.client.get('/admin/payouts');
    return data;
  }

  async adminGetDetails(id: string): Promise<ApiResponse<PayoutRequest & { events: any[] }>> {
    const { data } = await this.client.get(`/admin/payouts/${id}`);
    return data;
  }

  async adminApprove(id: string): Promise<ApiResponse<PayoutRequest>> {
    const { data } = await this.client.patch(`/admin/payouts/${id}/approve`);
    return data;
  }

  async adminReject(id: string, reason: string): Promise<ApiResponse<PayoutRequest>> {
    const { data } = await this.client.patch(`/admin/payouts/${id}/reject`, { reason });
    return data;
  }
}

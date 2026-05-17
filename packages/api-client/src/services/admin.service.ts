import { AxiosInstance } from 'axios';
import { ApiResponse, Merchant, User, Order, PayoutRequest } from '@dawwar/types';

export class AdminService {
  constructor(private client: AxiosInstance) {}

  async getMerchants(status?: 'pending' | 'approved'): Promise<ApiResponse<Merchant[]>> {
    const { data } = await this.client.get('/admin/merchants', { params: { status } });
    return data;
  }

  async approveMerchant(id: string): Promise<ApiResponse<Merchant>> {
    const { data } = await this.client.patch(`/admin/merchants/${id}/approve`);
    return data;
  }

  async rejectMerchant(id: string, reason: string): Promise<ApiResponse<Merchant>> {
    const { data } = await this.client.patch(`/admin/merchants/${id}/reject`, { reason });
    return data;
  }

  // ── Orders ────────────────────────────────────────────────────────

  async getOrders(status?: 'active' | 'all'): Promise<ApiResponse<Order[]>> {
    const { data } = await this.client.get('/admin/orders', { params: { status } });
    return data;
  }

  async cancelOrder(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post(`/admin/orders/${id}/cancel`);
    return data;
  }

  // ── Drivers ────────────────────────────────────────────────────────

  async getDrivers(status?: 'all' | 'online' | 'pending'): Promise<ApiResponse<any[]>> {
    const { data } = await this.client.get('/admin/drivers', { params: { status } });
    return data;
  }

  async approveDriver(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.patch(`/admin/drivers/${id}/approve`);
    return data;
  }

  async forceDriverOffline(id: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.patch(`/admin/drivers/${id}/offline`);
    return data;
  }

  // ── Customers ──────────────────────────────────────────────────────

  async getCustomers(): Promise<ApiResponse<User[]>> {
    const { data } = await this.client.get('/admin/customers');
    return data;
  }

  // ── Promo Codes ────────────────────────────────────────────────────

  async getPromos(): Promise<ApiResponse<any[]>> {
    const { data } = await this.client.get('/admin/promo');
    return data;
  }
}

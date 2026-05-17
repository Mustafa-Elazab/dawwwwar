import { AxiosInstance } from 'axios';
import { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

export class WalletService {
  constructor(private client: AxiosInstance) {}

  async getWallet(): Promise<ApiResponse<Wallet>> {
    const { data } = await this.client.get('/wallet');
    return data;
  }

  async getTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    const { data } = await this.client.get('/wallet/transactions');
    return data;
  }

  async recharge(amount: number): Promise<ApiResponse<{ paymentKey: string }>> {
    const { data } = await this.client.post('/wallet/recharge', { amount });
    return data;
  }
}

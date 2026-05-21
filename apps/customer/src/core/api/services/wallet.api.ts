import { api } from '../client';
import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

export const walletApi = {
  getWallet: async (userId: string): Promise<ApiResponse<Wallet>> => {
    const { data } = await api.get(`/wallet?userId=${userId}`);
    return data;
  },
  getTransactions: async (userId: string): Promise<ApiResponse<WalletTransaction[]>> => {
    const { data } = await api.get(`/wallet/transactions?userId=${userId}`);
    return data;
  },
  requestRecharge: async (userId: string, amount: number) => {
    const { data } = await api.post('/wallet/recharge', { userId, amount });
    return data;
  },
};

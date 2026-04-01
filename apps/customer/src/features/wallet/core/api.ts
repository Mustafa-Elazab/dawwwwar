import { walletMock } from '@dawwar/mocks';
import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

export const walletApi = {
  getWallet: (userId: string): Promise<ApiResponse<Wallet>> =>
    walletMock.getWallet(userId),

  getTransactions: (userId: string): Promise<ApiResponse<WalletTransaction[]>> =>
    walletMock.getTransactions(userId),

  requestRecharge: (userId: string, amount: number): Promise<ApiResponse<{ message: string; requestedAmount: number }>> =>
    walletMock.requestRecharge(userId, amount),
};

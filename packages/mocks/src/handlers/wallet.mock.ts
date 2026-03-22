import { delay } from '../utils/delay';
import { getWalletByUser, getTransactionsByUser } from '../db/wallets';
import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

export const walletMock = {
  getWallet: async (userId: string): Promise<ApiResponse<Wallet>> => {
    await delay(400);
    const w = getWalletByUser(userId);
    if (!w) throw Object.assign(new Error('NOT_FOUND'), { code: 'NOT_FOUND' });
    return { success: true, data: w };
  },

  getTransactions: async (userId: string): Promise<ApiResponse<WalletTransaction[]>> => {
    await delay(600);
    return { success: true, data: getTransactionsByUser(userId) };
  },

  requestRecharge: async (
    _userId: string,
    amount: number,
  ): Promise<ApiResponse<{ message: string; requestedAmount: number }>> => {
    await delay(800);
    if (amount < 10) throw new Error('AMOUNT_TOO_LOW');
    return {
      success: true,
      data: {
        message: 'Recharge request submitted. Will be processed within 24 hours.',
        requestedAmount: amount,
      },
    };
  },
};

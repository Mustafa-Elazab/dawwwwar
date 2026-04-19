import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { walletMock } from '@dawwar/mocks';
import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realWalletApi = {
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

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const walletApi = USE_MOCK_API ? walletMock : realWalletApi;

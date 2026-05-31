import api from '../../../core/api/client';
import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';

// ── Phase 2 real implementations ─────────────────────────────────────
const realWalletApi = {
  getWallet: async (): Promise<ApiResponse<Wallet>> => {
    const { data } = await api.get('/wallet');
    return data;
  },
  getTransactions: async (): Promise<ApiResponse<WalletTransaction[]>> => {
    const { data } = await api.get('/wallet/transactions');
    return data;
  },
  requestRecharge: async (amount: number) => {
    const { data } = await api.post('/wallet/recharge', { amount });
    return data;
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const walletApi = realWalletApi;

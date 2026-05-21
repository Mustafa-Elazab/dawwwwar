import type { ApiResponse, Wallet, WalletTransaction } from '@dawwar/types';
import { walletApi as walletService } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realWalletApi = {
  getWallet: async (userId: string): Promise<ApiResponse<Wallet>> =>
    walletService.getWallet(userId),
  getTransactions: async (userId: string): Promise<ApiResponse<WalletTransaction[]>> =>
    walletService.getTransactions(userId),
  requestRecharge: async (userId: string, amount: number) =>
    walletService.requestRecharge(userId, amount),
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const walletApi = realWalletApi;

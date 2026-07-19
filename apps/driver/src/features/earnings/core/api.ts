import api from '../../../core/api/client';
import type { WalletTransaction } from '@dawwar/types';

export interface DailyEarning {
  day: string;   // 'Mon', 'Tue', etc.
  dayAr: string; // 'الإثنين', etc.
  net: number;
  deliveries: number;
}

export interface EarningsSummary {
  todayDeliveries: number;
  todayGross: number;
  todayCommission: number;
  todayNet: number;
  weeklyData: DailyEarning[];
}

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// ── Phase 2 real implementations ─────────────────────────────────────
const realEarningsApi = {
  getSummary: async (): Promise<EarningsSummary> => {
    const { data } = await api.get('/driver/earnings');
    return data;
  },
  getTransactions: async (): Promise<WalletTransaction[]> => {
    const { data } = await api.get('/driver/transactions');
    return data;
  },
  getWalletBalance: async (): Promise<number> => {
    const { data } = await api.get('/driver/wallet');
    return data;
  },
};

export const earningsApi = realEarningsApi;

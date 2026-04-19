import { delay } from '@dawwar/mocks';
import { mockWallets, mockTransactions } from '@dawwar/mocks';
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

// Phase 1: deterministic mock data based on day of week
function generateWeeklyData(): DailyEarning[] {
  const today = new Date().getDay();
  const mockNets = [30, 45, 20, 55, 40, 0, 35]; // Sun–Sat
  const mockDeliveries = [3, 5, 2, 6, 4, 0, 4];
  return DAYS_EN.map((day, i) => ({
    day,
    dayAr: DAYS_AR[i] ?? day,
    net: i === today ? 30 : mockNets[i] ?? 0,
    deliveries: i === today ? 3 : mockDeliveries[i] ?? 0,
  }));
}

export const earningsApi = {
  getSummary: async (driverId: string): Promise<EarningsSummary> => {
    await delay(500);
    const weekly = generateWeeklyData();
    const today = weekly[new Date().getDay()];
    return {
      todayDeliveries: today?.deliveries ?? 0,
      todayGross: (today?.net ?? 0) + 3 * 5, // net + commissions paid
      todayCommission: 3 * 5,
      todayNet: today?.net ?? 0,
      weeklyData: weekly,
    };
  },

  getTransactions: async (driverId: string): Promise<WalletTransaction[]> => {
    await delay(400);
    const wallet = mockWallets.find((w) => w.userId === driverId);
    if (!wallet) return [];
    return mockTransactions.filter((t) => t.walletId === wallet.id);
  },

  getWalletBalance: async (driverId: string): Promise<number> => {
    await delay(300);
    const wallet = mockWallets.find((w) => w.userId === driverId);
    return wallet?.balance ?? 0;
  },
};

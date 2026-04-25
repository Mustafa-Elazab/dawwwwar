import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay } from '@dawwar/mocks';

export interface DriverAnalytics {
  totalDeliveries: number;
  totalEarnings: number;
  avgEarningsPerDelivery: number;
  commissionPaid: number;
  rating: number;
  totalRatings: number;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realAnalyticsApi = {
  getToday: async () => {
    const { data } = await api.get('/analytics/driver/today');
    return data.data as DriverAnalytics;
  },
  getRange: async (startDate: string, endDate: string) => {
    const { data } = await api.get('/analytics/driver/range', {
      params: { startDate, endDate },
    });
    return data.data as DriverAnalytics;
  },
};

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockAnalyticsApi = {
  getToday: async (): Promise<DriverAnalytics> => {
    await delay(400);
    return {
      totalDeliveries: 12,
      totalEarnings: 180,
      avgEarningsPerDelivery: 15,
      commissionPaid: 24,
      rating: 4.8,
      totalRatings: 45,
    };
  },
  getRange: async (_startDate: string, _endDate: string): Promise<DriverAnalytics> => {
    await delay(400);
    return {
      totalDeliveries: 45,
      totalEarnings: 675,
      avgEarningsPerDelivery: 15,
      commissionPaid: 90,
      rating: 4.8,
      totalRatings: 45,
    };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const analyticsApi = USE_MOCK_API ? mockAnalyticsApi : realAnalyticsApi;

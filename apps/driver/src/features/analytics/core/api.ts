import api from '../../../core/api/client';

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


export const analyticsApi = realAnalyticsApi;

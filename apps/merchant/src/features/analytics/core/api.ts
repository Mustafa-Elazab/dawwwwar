import api from '../../../core/api/client';
import { OrderStatus } from '@dawwar/types';

export interface MerchantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  commissionPaid: number;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realAnalyticsApi = {
  getToday: async (_merchantId: string): Promise<MerchantAnalytics> => {
    const { data } = await api.get('/analytics/merchant/today');
    return data.data;
  },
  getRange: async (
    _merchantId: string,
    startDate: string,
    endDate: string,
  ): Promise<MerchantAnalytics> => {
    const { data } = await api.get('/analytics/merchant/range', {
      params: { startDate, endDate },
    });
    return data.data;
  },
};


export const analyticsApi = realAnalyticsApi;

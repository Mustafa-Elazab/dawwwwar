import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { delay, mockOrders } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';

export interface MerchantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  commissionPaid: number;
}

// ── Phase 2 real implementations ─────────────────────────────────────
const realAnalyticsApi = {
  getToday: async (merchantId: string) => {
    const { data } = await api.get(`/merchant/analytics?merchantId=${merchantId}`);
    return data;
  },
};

// ── Phase 1 mock implementation ──────────────────────────────────────
const mockAnalyticsApi = {
  getToday: async (merchantId: string): Promise<MerchantAnalytics> => {
    await delay(400);
    const orders = mockOrders.filter(
      (o) => o.merchantId === merchantId &&
        (o.status === OrderStatus.COMPLETED || o.status === OrderStatus.DELIVERED),
    );
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const commissionPaid = orders.length * 5;
    return {
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      commissionPaid,
    };
  },
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const analyticsApi = USE_MOCK_API ? mockAnalyticsApi : realAnalyticsApi;

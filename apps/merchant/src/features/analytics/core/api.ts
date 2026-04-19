import { delay } from '@dawwar/mocks';
import { mockOrders } from '@dawwar/mocks';
import { OrderStatus } from '@dawwar/types';

export interface MerchantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  commissionPaid: number;
}

export const analyticsApi = {
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

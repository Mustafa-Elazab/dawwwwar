import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../database/entities/order.entity';
import { MerchantsService } from '../merchants/merchants.service';
import { DriversService } from '../drivers/drivers.service';

export interface MerchantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  commissionPaid: number;
}

export interface DriverAnalytics {
  totalDeliveries: number;
  totalEarnings: number;
  avgEarningsPerDelivery: number;
  commissionPaid: number;
  rating: number;
  totalRatings: number;
}

export interface CustomerAnalytics {
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
  favoriteMerchant?: string;
}

export interface PlatformAnalytics {
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  activeMerchants: number;
  activeDrivers: number;
  newCustomers: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly merchantsService: MerchantsService,
    private readonly driversService: DriversService,
  ) {}

  // ─── Merchant Analytics ───────────────────────────────────────────

  async getMerchantToday(userId: string): Promise<MerchantAnalytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getMerchantAnalyticsForRange(userId, { startDate: today, endDate: new Date() });
  }

  async getMerchantAnalyticsForRange(
    userId: string,
    range: DateRange,
  ): Promise<MerchantAnalytics> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) return { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, commissionPaid: 0 };

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.merchantId = :merchantId', { merchantId: merchant.id })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
      })
      .andWhere('order.createdAt BETWEEN :start AND :end', {
        start: range.startDate,
        end: range.endDate,
      })
      .getMany();

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const commissionPaid = orders.length * Number(merchant.commissionRate);

    return {
      totalOrders: orders.length,
      totalRevenue,
      avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      commissionPaid,
    };
  }

  // ─── Driver Analytics ─────────────────────────────────────────────

  async getDriverToday(userId: string): Promise<DriverAnalytics> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.getDriverAnalyticsForRange(userId, { startDate: today, endDate: new Date() });
  }

  async getDriverAnalyticsForRange(
    userId: string,
    range: DateRange,
  ): Promise<DriverAnalytics> {
    const driver = await this.driversService.getProfile(userId);

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.driverId = :driverId', { driverId: userId })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
      })
      .andWhere('order.createdAt BETWEEN :start AND :end', {
        start: range.startDate,
        end: range.endDate,
      })
      .getMany();

    const totalEarnings = orders.reduce((s, o) => s + Number(o.deliveryFee), 0);
    const commissionPaid = orders.reduce((s, o) => s + Number(o.driverCommission), 0);
    const netEarnings = totalEarnings - commissionPaid;

    return {
      totalDeliveries: orders.length,
      totalEarnings: netEarnings,
      avgEarningsPerDelivery: orders.length > 0 ? netEarnings / orders.length : 0,
      commissionPaid,
      rating: Number(driver.rating),
      totalRatings: driver.totalRatings,
    };
  }

  // ─── Customer Analytics ───────────────────────────────────────────

  async getCustomerAnalytics(userId: string): Promise<CustomerAnalytics> {
    const orders = await this.orderRepo.find({
      where: { customerId: userId, status: OrderStatus.COMPLETED },
      order: { createdAt: 'DESC' },
    });

    const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0);

    // Find favorite merchant
    const merchantCounts = new Map<string, number>();
    for (const order of orders) {
      if (order.merchantId) {
        const count = merchantCounts.get(order.merchantId) ?? 0;
        merchantCounts.set(order.merchantId, count + 1);
      }
    }
    let favoriteMerchant: string | undefined;
    let maxCount = 0;
    for (const [merchantId, count] of merchantCounts) {
      if (count > maxCount) {
        maxCount = count;
        favoriteMerchant = merchantId;
      }
    }

    return {
      totalOrders: orders.length,
      totalSpent,
      avgOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
      favoriteMerchant,
    };
  }

  // ─── Admin / Platform Analytics ─────────────────────────────────────

  async getPlatformAnalytics(range: DateRange): Promise<PlatformAnalytics> {
    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.status IN (:...statuses)', {
        statuses: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
      })
      .andWhere('order.createdAt BETWEEN :start AND :end', {
        start: range.startDate,
        end: range.endDate,
      })
      .getMany();

    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const totalCommission = orders.reduce(
      (s, o) => s + Number(o.merchantCommission) + Number(o.driverCommission),
      0,
    );

    // Count unique merchants and drivers in this period
    const merchantIds = new Set(orders.map((o) => o.merchantId).filter(Boolean));
    const driverIds = new Set(orders.map((o) => o.driverId).filter(Boolean));

    // New customers = customers who placed their first order in this period
    const allCompletedOrders = await this.orderRepo.find({
      where: { status: OrderStatus.COMPLETED },
      order: { createdAt: 'ASC' },
    });
    const firstOrderDates = new Map<string, Date>();
    for (const order of allCompletedOrders) {
      if (!firstOrderDates.has(order.customerId)) {
        firstOrderDates.set(order.customerId, order.createdAt);
      }
    }
    const newCustomers = Array.from(firstOrderDates.entries()).filter(([, date]) => {
      return date >= range.startDate && date <= range.endDate;
    }).length;

    return {
      totalOrders: orders.length,
      totalRevenue,
      totalCommission,
      activeMerchants: merchantIds.size,
      activeDrivers: driverIds.size,
      newCustomers,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../database/entities/order.entity';
import { MerchantsService } from '../merchants/merchants.service';

export interface MerchantAnalytics {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  commissionPaid: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly merchantsService: MerchantsService,
  ) {}

  async getMerchantToday(userId: string): Promise<MerchantAnalytics> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) return { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, commissionPaid: 0 };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .where('order.merchantId = :merchantId', { merchantId: merchant.id })
      .andWhere('order.status IN (:...statuses)', {
        statuses: [OrderStatus.COMPLETED, OrderStatus.DELIVERED],
      })
      .andWhere('order.createdAt >= :start', { start: todayStart })
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
}

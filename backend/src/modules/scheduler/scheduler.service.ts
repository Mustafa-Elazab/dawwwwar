import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { OrderEntity, OrderStatus } from '../../database/entities/order.entity';
import { GatewayService } from '../gateway/gateway.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly gatewayService: GatewayService,
  ) {}

  /**
   * Runs every minute — activates scheduled orders whose deliverAt time has passed.
   * Moves them from PENDING (scheduled) to PENDING (active) by clearing deliverAt
   * and emitting a socket notification so the merchant app picks it up.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async activateScheduledOrders() {
    const now = new Date();

    const scheduledOrders = await this.orderRepo.find({
      where: {
        status: OrderStatus.PENDING,
        deliverAt: LessThanOrEqual(now),
      },
    });

    if (scheduledOrders.length === 0) return;

    this.logger.log(`Activating ${scheduledOrders.length} scheduled order(s)`);

    for (const order of scheduledOrders) {
      // Clear deliverAt so it doesn't re-trigger
      await this.orderRepo.update(order.id, { deliverAt: undefined });

      // Emit new-order event to merchant
      if (order.merchantId) {
        this.gatewayService.notifyNewOrder(order.merchantId, order);
      }

      this.logger.debug(`Activated scheduled order ${order.orderNumber}`);
    }
  }
}

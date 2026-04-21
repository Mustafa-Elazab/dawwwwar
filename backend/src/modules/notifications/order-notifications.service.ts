import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsService } from './notifications.service';
import { UserEntity } from '../../database/entities/user.entity';
import type { OrderEntity } from '../../database/entities/order.entity';

@Injectable()
export class OrderNotificationsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly notificationsService: NotificationsService,
  ) {}

  private async getUserToken(userId: string): Promise<string | null> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'fcmToken'],
    });
    return user?.fcmToken ?? null;
  }

  /** Notify merchant of a new incoming order */
  async notifyMerchantNewOrder(order: OrderEntity): Promise<void> {
    if (!order.merchantId) return;

    // Get merchant user ID from merchant profile
    // merchantId is the merchant profile ID — need the merchant's userId
    // We join through the merchant table in Phase 3; for now use a direct query
    const merchantUser = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('merchants', 'merchant', 'merchant.user_id = user.id')
      .where('merchant.id = :merchantId', { merchantId: order.merchantId })
      .getOne();

    if (!merchantUser?.fcmToken) return;

    await this.notificationsService.sendToDevice(
      merchantUser.fcmToken,
      '🔔 طلب جديد!',
      `${order.total} ج.م — استجب قبل انتهاء الوقت`,
      {
        type: 'NEW_ORDER',
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: String(order.total),
      },
    );
  }

  /** Notify customer of order status change */
  async notifyCustomerStatusChange(
    order: OrderEntity,
    statusMessage: string,
  ): Promise<void> {
    const token = await this.getUserToken(order.customerId);
    if (!token) return;

    await this.notificationsService.sendToDevice(
      token,
      'تحديث طلبك',
      statusMessage,
      {
        type: 'ORDER_STATUS',
        orderId: order.id,
        status: order.status,
      },
    );
  }

  /** Notify customer that a driver was assigned */
  async notifyCustomerDriverAssigned(order: OrderEntity): Promise<void> {
    const token = await this.getUserToken(order.customerId);
    if (!token) return;

    await this.notificationsService.sendToDevice(
      token,
      '🛵 السائق في الطريق',
      'تم تعيين سائق لطلبك',
      {
        type: 'DRIVER_ASSIGNED',
        orderId: order.id,
      },
    );
  }

  /** Notify customer of rejection */
  async notifyCustomerOrderRejected(order: OrderEntity): Promise<void> {
    const token = await this.getUserToken(order.customerId);
    if (!token) return;

    await this.notificationsService.sendToDevice(
      token,
      '❌ تم رفض طلبك',
      'رفض المحل طلبك. يمكنك تجربة محل آخر.',
      {
        type: 'ORDER_REJECTED',
        orderId: order.id,
      },
    );
  }
}

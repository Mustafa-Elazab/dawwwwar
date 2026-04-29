import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import {
  OrderEntity,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../../database/entities/order.entity';
import { OrderItemEntity } from '../../database/entities/order-item.entity';
import { ProductEntity } from '../../database/entities/product.entity';
import { WalletEntity } from '../../database/entities/wallet.entity';
import {
  WalletTransactionEntity,
  TransactionReason,
  TransactionType,
} from '../../database/entities/wallet-transaction.entity';
import { DriverProfileEntity } from '../../database/entities/driver-profile.entity';
import { MerchantsService } from '../merchants/merchants.service';
import { OrderNumberService } from './order-number.service';
import { GatewayService } from '../gateway/gateway.service';
import { OrderNotificationsService } from '../notifications/order-notifications.service';
import { DriversService } from '../drivers/drivers.service';
import { PromoService } from '../promo/promo.service';
import type { PlaceOrderDto } from './dto/place-order.dto';
import type { PlaceCustomOrderDto } from './dto/place-custom-order.dto';
import type { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

const ACTIVE_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
  OrderStatus.DRIVER_ASSIGNED,
  OrderStatus.AT_SHOP,
  OrderStatus.SHOPPING,
  OrderStatus.PURCHASED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
];

const COMMISSION_PER_ORDER = 5; // EGP

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemEntity)
    private readonly itemRepo: Repository<OrderItemEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    @InjectRepository(WalletTransactionEntity)
    private readonly txRepo: Repository<WalletTransactionEntity>,
    @InjectRepository(DriverProfileEntity)
    private readonly driverProfileRepo: Repository<DriverProfileEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly merchantsService: MerchantsService,
    private readonly orderNumberService: OrderNumberService,
    private readonly dataSource: DataSource,
    private readonly gatewayService: GatewayService,
    private readonly orderNotifications: OrderNotificationsService,
    private readonly driversService: DriversService,
    private readonly promoService: PromoService,
  ) {}

  // ── Customer: place regular order ─────────────────────────────────
  async placeOrder(customerId: string, dto: PlaceOrderDto): Promise<OrderEntity> {
    const merchant = await this.merchantsService.findById(dto.merchantId);
    if (!merchant.isOpen || !merchant.canReceiveOrders) {
      throw new BadRequestException('MERCHANT_NOT_ACCEPTING');
    }

    // #10 — Validate product prices from DB (prevent client-side tampering)
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.productRepo.find({
      where: { id: In(productIds), merchantId: dto.merchantId },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        throw new BadRequestException('PRODUCT_NOT_FOUND');
      }
      if (!dbProduct.isAvailable) {
        throw new BadRequestException('PRODUCT_UNAVAILABLE');
      }
      // Override client-sent price with actual DB price
      item.price = Number(dbProduct.price);
      item.productName = dbProduct.name;
      item.productNameAr = dbProduct.nameAr;
    }

    const subtotal = dto.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // #13 — Apply promo code discount
    let discount = 0;
    if (dto.promoCode) {
      const promoResult = await this.promoService.validatePromo({
        code: dto.promoCode,
        orderAmount: subtotal,
      });
      if (!promoResult.valid) {
        throw new BadRequestException(promoResult.error ?? 'INVALID_PROMO_CODE');
      }
      discount = promoResult.discountAmount;
    }

    const total = Math.max(subtotal - discount + dto.deliveryFee, 0);

    // Validate wallet if payment method is WALLET
    if (dto.paymentMethod === PaymentMethod.WALLET) {
      await this.checkWalletBalance(customerId, total);
    }

    const orderNumber = await this.orderNumberService.generate();

    return this.dataSource
      .transaction(async (manager) => {
        const order = manager.create(OrderEntity, {
          orderNumber,
          customerId,
          merchantId: dto.merchantId,
          type: OrderType.REGULAR,
          status: OrderStatus.PENDING,
          subtotal,
          deliveryFee: dto.deliveryFee,
          total,
          discount,
          paymentMethod: dto.paymentMethod,
          isPaid: dto.paymentMethod === PaymentMethod.WALLET,
          merchantCommission: COMMISSION_PER_ORDER,
          driverCommission: COMMISSION_PER_ORDER,
          commissionsDeducted: false,
          deliveryAddress: dto.deliveryAddress,
          deliveryLatitude: dto.deliveryLatitude,
          deliveryLongitude: dto.deliveryLongitude,
          deliveryPhone: dto.deliveryPhone,
          deliveryNotes: dto.deliveryNotes,
          // #12 — Scheduled orders
          deliverAt: dto.deliverAt ? new Date(dto.deliverAt) : undefined,
        });
        const saved = await manager.save(order);

        // Save order items
        const items = dto.items.map((i) =>
          manager.create(OrderItemEntity, {
            orderId: saved.id,
            productId: i.productId,
            productName: i.productName,
            productNameAr: i.productNameAr,
            quantity: i.quantity,
            price: i.price,
          }),
        );
        await manager.save(items);

        // Deduct from wallet immediately if WALLET payment
        if (dto.paymentMethod === PaymentMethod.WALLET) {
          await this.deductWallet(
            manager,
            customerId,
            total,
            saved.id,
            'Payment for order ' + orderNumber,
          );
          await manager.update(OrderEntity, saved.id, { isPaid: true });
        }

        return manager.findOne(OrderEntity, {
          where: { id: saved.id },
          relations: ['items'],
        }) as Promise<OrderEntity>;
      })
      .then((order) => {
        // Notify merchant of new order (outside transaction)
        if (order.merchantId) {
          this.gatewayService.notifyNewOrder(order.merchantId, order);
          // FCM push notification for merchant
          void this.orderNotifications.notifyMerchantNewOrder(order).catch(() => {});
        }
        // Increment promo code usage
        if (dto.promoCode) {
          void this.promoService.markUsed(dto.promoCode).catch(() => {});
        }
        return order;
      });
  }

  // ── Customer: place custom order ───────────────────────────────────
  async placeCustomOrder(customerId: string, dto: PlaceCustomOrderDto): Promise<OrderEntity> {
    const total = dto.estimatedBudget + dto.deliveryFee;

    if (dto.paymentMethod === PaymentMethod.WALLET) {
      await this.checkWalletBalance(customerId, total);
    }

    const orderNumber = await this.orderNumberService.generate();

    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(OrderEntity, {
        orderNumber,
        customerId,
        type: OrderType.CUSTOM,
        status: OrderStatus.PENDING,
        subtotal: dto.estimatedBudget,
        deliveryFee: dto.deliveryFee,
        total,
        discount: 0,
        paymentMethod: dto.paymentMethod,
        isPaid: dto.paymentMethod === PaymentMethod.WALLET,
        shopName: dto.shopName,
        shopAddress: dto.shopAddress,
        shopLatitude: dto.shopLatitude,
        shopLongitude: dto.shopLongitude,
        itemsDescription: dto.itemsDescription,
        itemsVoiceNote: dto.itemsVoiceNote,
        itemsImages: dto.itemsImages,
        estimatedBudget: dto.estimatedBudget,
        merchantCommission: 0,
        driverCommission: COMMISSION_PER_ORDER,
        commissionsDeducted: false,
        deliveryAddress: dto.deliveryAddress,
        deliveryLatitude: dto.deliveryLatitude,
        deliveryLongitude: dto.deliveryLongitude,
        deliveryPhone: dto.deliveryPhone,
        deliverAt: dto.deliverAt ? new Date(dto.deliverAt) : undefined,
      });
      const saved = await manager.save(order);

      if (dto.paymentMethod === PaymentMethod.WALLET) {
        await this.deductWallet(
          manager,
          customerId,
          total,
          saved.id,
          'Custom order ' + orderNumber,
        );
        await manager.update(OrderEntity, saved.id, { isPaid: true });
      }

      return saved;
    });
  }

  // ── Customer: get my orders ────────────────────────────────────────
  async getCustomerOrders(customerId: string): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { customerId },
      relations: ['items', 'merchant'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'merchant', 'driver'],
    });
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');
    return order;
  }

  // ── Merchant: get orders ───────────────────────────────────────────
  async getMerchantOrders(userId: string): Promise<OrderEntity[]> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');
    return this.orderRepo.find({
      where: { merchantId: merchant.id },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  // ── Merchant: accept order ─────────────────────────────────────────
  async merchantAccept(orderId: string, userId: string, prepMinutes: number): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    const merchant = await this.merchantsService.findByUserId(userId);

    if (!merchant || order.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_MANAGE_ORDER');
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('ORDER_NOT_PENDING');
    }

    await this.orderRepo.update(orderId, {
      status: OrderStatus.ACCEPTED,
      acceptedAt: new Date(),
    });

    const updated = await this.getOrderById(orderId);
    // Notify customer of status change
    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.ACCEPTED, updated);
      // FCM push notification for customer
      void this.orderNotifications
        .notifyCustomerStatusChange(updated, '✅ قبل المحل طلبك — جاري التحضير')
        .catch(() => {});
    }

    // P3-03 · Auto Driver Assignment
    if (updated.deliveryLatitude && updated.deliveryLongitude) {
      // Find nearest online driver within 5km from the merchant
      const searchLat = updated.merchant?.latitude ?? updated.deliveryLatitude;
      const searchLng = updated.merchant?.longitude ?? updated.deliveryLongitude;
      const nearestDriver = await this.driversService.findNearestOnlineDriver(
        searchLat,
        searchLng,
        5,
      );

      if (nearestDriver) {
        // Auto-assign
        await this.orderRepo.update(orderId, {
          driverId: nearestDriver.userId,
          status: OrderStatus.DRIVER_ASSIGNED,
          assignedAt: new Date(),
        });

        const assignedOrder = await this.getOrderById(orderId);

        // Notify customer
        this.gatewayService.notifyOrderStatusChanged(
          orderId,
          OrderStatus.DRIVER_ASSIGNED,
          assignedOrder,
        );
        void this.orderNotifications.notifyCustomerDriverAssigned(assignedOrder).catch(() => {});

        // Notify the assigned driver
        this.gatewayService.notifyDriverAssigned(orderId, updated.customerId, nearestDriver.user);
      }
    }

    return this.getOrderById(orderId);
  }

  // ── Merchant: reject order ─────────────────────────────────────────
  async merchantReject(orderId: string, userId: string, reason: string): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    const merchant = await this.merchantsService.findByUserId(userId);

    if (!merchant || order.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_MANAGE_ORDER');
    }

    // Refund wallet if paid
    if (order.isPaid && order.paymentMethod === PaymentMethod.WALLET) {
      await this.refundWallet(order.customerId, order.total, orderId, 'Refund: order rejected');
    }

    await this.orderRepo.update(orderId, {
      status: OrderStatus.REJECTED,
      cancelledAt: new Date(),
    });

    const updated = await this.getOrderById(orderId);
    // Notify customer of status change
    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.REJECTED, updated);
      // FCM push notification for customer
      void this.orderNotifications.notifyCustomerOrderRejected(updated).catch(() => {});
    }
    return updated;
  }

  // ── Merchant: mark ready ───────────────────────────────────────────
  async merchantMarkReady(orderId: string, userId: string): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant || order.merchantId !== merchant.id) {
      throw new ForbiddenException('ACCESS_DENIED');
    }
    if (order.status !== OrderStatus.ACCEPTED && order.status !== OrderStatus.DRIVER_ASSIGNED) {
      throw new BadRequestException('ORDER_NOT_READY_TO_MARK');
    }

    // If a driver is already assigned, move to PICKED_UP (ready for pickup)
    // If no driver yet, keep DRIVER_ASSIGNED so driver list can pick it up
    const newStatus = order.driverId ? OrderStatus.PICKED_UP : OrderStatus.ACCEPTED;
    await this.orderRepo.update(orderId, { status: newStatus });

    const updated = await this.getOrderById(orderId);
    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, newStatus, updated);
      void this.orderNotifications
        .notifyCustomerStatusChange(updated, '✅ طلبك جاهز للاستلام')
        .catch(() => {});
    }
    return updated;
  }

  // ── Driver: accept order ───────────────────────────────────────────
  async driverAccept(orderId: string, driverId: string): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.ACCEPTED) {
      throw new BadRequestException('ORDER_ALREADY_TAKEN');
    }

    await this.orderRepo.update(orderId, {
      driverId,
      status: OrderStatus.DRIVER_ASSIGNED,
      assignedAt: new Date(),
    });

    const updated = await this.getOrderById(orderId);
    // Notify customer of driver assignment
    if (order.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.DRIVER_ASSIGNED, updated);
      // FCM push notification for customer
      void this.orderNotifications.notifyCustomerDriverAssigned(updated).catch(() => {});
    }
    return updated;
  }

  // ── Driver: decline order ──────────────────────────────────────────
  async driverDecline(orderId: string, driverId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    // If this driver was assigned, unassign them
    if (order.driverId === driverId) {
      await this.orderRepo.update(orderId, {
        driverId: undefined,
        status: OrderStatus.ACCEPTED,
        assignedAt: undefined,
      });

      // Try to find the next nearest online driver (exclude this one)
      if (order.merchant?.latitude && order.merchant?.longitude) {
        const nextDriver = await this.driversService.findNearestOnlineDriver(
          order.merchant.latitude,
          order.merchant.longitude,
          5,
        );
        if (nextDriver && nextDriver.userId !== driverId) {
          await this.orderRepo.update(orderId, {
            driverId: nextDriver.userId,
            status: OrderStatus.DRIVER_ASSIGNED,
            assignedAt: new Date(),
          });
          const updated = await this.getOrderById(orderId);
          this.gatewayService.notifyOrderStatusChanged(
            orderId,
            OrderStatus.DRIVER_ASSIGNED,
            updated,
          );
          this.gatewayService.notifyDriverAssigned(orderId, order.customerId, nextDriver.user);
          void this.orderNotifications.notifyCustomerDriverAssigned(updated).catch(() => {});
        }
      }
    }
  }

  // ── Driver: update status ──────────────────────────────────────────
  async updateDeliveryStatus(
    orderId: string,
    driverId: string,
    dto: UpdateDeliveryStatusDto,
  ): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);

    if (order.driverId !== driverId) {
      throw new ForbiddenException('NOT_ASSIGNED_TO_ORDER');
    }

    const updateData: Partial<OrderEntity> = { status: dto.status };

    if (dto.status === OrderStatus.PICKED_UP || dto.status === OrderStatus.AT_SHOP) {
      // no timestamp field for these in entity, handled by updatedAt
    }
    if (dto.status === OrderStatus.IN_TRANSIT) {
      updateData.pickedUpAt = new Date();
      if (dto.actualAmount !== undefined) updateData.actualAmount = dto.actualAmount;
      if (dto.receiptImage) updateData.receiptImage = dto.receiptImage;
    }
    if (dto.status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }
    if (dto.status === OrderStatus.COMPLETED) {
      updateData.completedAt = new Date();

      // Deduct commissions from merchant and driver wallets
      if (!order.commissionsDeducted) {
        await this.deductCommissions(order);
        updateData.commissionsDeducted = true;
      }
    }

    await this.orderRepo.update(orderId, updateData as any);
    const updated = await this.getOrderById(orderId);
    // Notify customer of status change
    if (order.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, dto.status, updated);
      // FCM push notifications for key status changes
      if (dto.status === OrderStatus.IN_TRANSIT) {
        void this.orderNotifications
          .notifyCustomerStatusChange(updated, '🛵 طلبك في الطريق إليك')
          .catch(() => {});
      }
      if (dto.status === OrderStatus.COMPLETED) {
        void this.orderNotifications
          .notifyCustomerStatusChange(updated, '✅ تم توصيل طلبك بنجاح')
          .catch(() => {});
      }
    }
    return updated;
  }

  // ── Customer: cancel order ──────────────────────────────────────────
  async customerCancel(orderId: string, customerId: string): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    if (order.customerId !== customerId) throw new ForbiddenException('NOT_YOUR_ORDER');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('CAN_ONLY_CANCEL_PENDING');
    }

    // Refund wallet if already paid
    if (order.isPaid && order.paymentMethod === PaymentMethod.WALLET) {
      await this.refundWallet(
        order.customerId,
        order.total,
        orderId,
        'Refund: order cancelled by customer',
      );
    }

    await this.orderRepo.update(orderId, {
      status: OrderStatus.CANCELLED,
      cancelledAt: new Date(),
    });

    const updated = await this.getOrderById(orderId);
    if (order.merchantId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.CANCELLED, updated);
    }
    return updated;
  }

  // ── Driver: get available orders ────────────────────────────────────
  async getAvailableOrders(): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: {
        status: In([OrderStatus.PENDING, OrderStatus.ACCEPTED]),
        driverId: IsNull(),
      },
      relations: ['merchant', 'items'],
      order: { createdAt: 'ASC' },
    });
  }

  // ── Driver: get active order ───────────────────────────────────────
  async getDriverActiveOrder(driverId: string): Promise<OrderEntity | null> {
    return this.orderRepo.findOne({
      where: {
        driverId,
        status: In([
          OrderStatus.DRIVER_ASSIGNED,
          OrderStatus.AT_SHOP,
          OrderStatus.SHOPPING,
          OrderStatus.PURCHASED,
          OrderStatus.PICKED_UP,
          OrderStatus.IN_TRANSIT,
          OrderStatus.DELIVERED,
        ]),
      },
      relations: ['merchant', 'items'],
    });
  }

  // ── Customer: tip for completed order ──────────────────────────────
  async addTip(orderId: string, customerId: string, amount: number): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');
    if (order.customerId !== customerId) throw new ForbiddenException('NOT_YOUR_ORDER');
    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException('CAN_ONLY_TIP_COMPLETED');
    }
    if (amount <= 0) throw new BadRequestException('INVALID_TIP_AMOUNT');

    // Make sure they have wallet balance
    await this.checkWalletBalance(customerId, amount);

    await this.dataSource.transaction(async (manager) => {
      // deduct from customer
      await this.deductWallet(
        manager,
        customerId,
        amount,
        orderId,
        `Tip for order ${order.orderNumber}`,
      );

      // add to driver
      if (order.driverId) {
        const wallet = await manager.findOne(WalletEntity, { where: { userId: order.driverId } });
        if (wallet) {
          const balanceBefore = Number(wallet.balance);
          const balanceAfter = balanceBefore + amount;
          await manager.update(WalletEntity, wallet.id, { balance: balanceAfter });
          await manager.save(
            manager.create(WalletTransactionEntity, {
              walletId: wallet.id,
              type: TransactionType.CREDIT,
              amount,
              reason: TransactionReason.TIP,
              orderId,
              description: `Tip from customer for order ${order.orderNumber}`,
              balanceBefore,
              balanceAfter,
            }),
          );
        }
      }

      const currentTip = Number(order.tipAmount || 0);
      await manager.update(OrderEntity, orderId, { tipAmount: currentTip + amount });
    });

    return this.getOrderById(orderId);
  }

  // ── Private helpers ───────────────────────────────────────────────
  private async checkWalletBalance(userId: string, amount: number): Promise<void> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet || Number(wallet.balance) < amount) {
      throw new BadRequestException('INSUFFICIENT_WALLET_BALANCE');
    }
  }

  private async deductWallet(
    manager: any,
    userId: string,
    amount: number,
    orderId: string,
    description: string,
  ): Promise<void> {
    const wallet = await manager.findOne(WalletEntity, { where: { userId } });
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore - amount;
    await manager.update(WalletEntity, wallet.id, { balance: balanceAfter });
    await manager.save(
      manager.create(WalletTransactionEntity, {
        walletId: wallet.id,
        type: TransactionType.DEBIT,
        amount,
        reason: TransactionReason.ORDER_PAYMENT,
        orderId,
        description,
        balanceBefore,
        balanceAfter,
      }),
    );
  }

  private async refundWallet(
    userId: string,
    amount: number,
    orderId: string,
    description: string,
  ): Promise<void> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });
    if (!wallet) return;
    const balanceBefore = Number(wallet.balance);
    const balanceAfter = balanceBefore + amount;
    await this.walletRepo.update(wallet.id, { balance: balanceAfter });
    await this.txRepo.save(
      this.txRepo.create({
        walletId: wallet.id,
        type: TransactionType.CREDIT,
        amount,
        reason: TransactionReason.REFUND,
        orderId,
        description,
        balanceBefore,
        balanceAfter,
      }),
    );
  }

  private async deductCommissions(order: OrderEntity): Promise<void> {
    // Deduct merchant commission
    if (order.merchantId && Number(order.merchantCommission) > 0) {
      const merchant = await this.merchantsService.findById(order.merchantId);
      const wallet = await this.walletRepo.findOne({ where: { userId: merchant.userId } });
      if (wallet) {
        const balanceBefore = Number(wallet.balance);
        const amount = Number(order.merchantCommission);
        const balanceAfter = balanceBefore - amount;
        await this.walletRepo.update(wallet.id, { balance: balanceAfter });
        await this.txRepo.save(
          this.txRepo.create({
            walletId: wallet.id,
            type: TransactionType.DEBIT,
            amount,
            reason: TransactionReason.COMMISSION_DEDUCTION,
            orderId: order.id,
            description: `Merchant commission for order ${order.orderNumber}`,
            balanceBefore,
            balanceAfter,
          }),
        );
      }
    }

    // Deduct driver commission
    if (order.driverId && Number(order.driverCommission) > 0) {
      const wallet = await this.walletRepo.findOne({ where: { userId: order.driverId } });
      if (wallet) {
        const balanceBefore = Number(wallet.balance);
        const amount = Number(order.driverCommission);
        const balanceAfter = balanceBefore - amount;
        await this.walletRepo.update(wallet.id, { balance: balanceAfter });
        await this.txRepo.save(
          this.txRepo.create({
            walletId: wallet.id,
            type: TransactionType.DEBIT,
            amount,
            reason: TransactionReason.COMMISSION_DEDUCTION,
            orderId: order.id,
            description: `Driver commission for order ${order.orderNumber}`,
            balanceBefore,
            balanceAfter,
          }),
        );
      }
    }
  }
}

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, IsNull, Repository } from 'typeorm';
import {
  OrderEntity,
  OrderEventEntity,
  OrderStatus,
  OrderType,
  PaymentMethod,
} from '../../database/entities';
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
import { SOCKET_EVENTS } from '../gateway/events';
import { OrderNotificationsService } from '../notifications/order-notifications.service';
import { DriversService } from '../drivers/drivers.service';
import { PromoService } from '../promo/promo.service';
import { WalletService } from '../wallet/wallet.service';
import { DeliveryFeeService } from './delivery-fee.service';
import { validateOrderTransition, FINAL_STATUSES } from './orders.state-machine';
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

const PLATFORM_DRIVER_COMMISSION = 5; // EGP flat fee per delivery for now

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderEventEntity)
    private readonly eventRepo: Repository<OrderEventEntity>,
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
    private readonly walletService: WalletService,
    private readonly deliveryFeeService: DeliveryFeeService,
  ) {}

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'merchant', 'driver', 'driver.user', 'customer', 'events'],
    });
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');
    return order;
  }

  async getDeliveryFeePreview(
    merchantId: string,
    customerLat: number,
    customerLng: number,
    orderTotal: number,
  ): Promise<{ fee: number; distanceKm: number; isFree: boolean }> {
    const merchant = await this.merchantsService.findById(merchantId);
    return this.deliveryFeeService.calculateFee(
      merchant.latitude,
      merchant.longitude,
      customerLat,
      customerLng,
      orderTotal,
    );
  }

  private async createOrderEvent(
    manager: EntityManager,
    orderId: string,
    status: OrderStatus,
    title: string,
    titleAr: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await manager.save(
      manager.create(OrderEventEntity, {
        orderId,
        status,
        title,
        titleAr,
        metadata,
      }),
    );
  }

  // ── Customer: place regular order ─────────────────────────────────
  async placeOrder(customerId: string, dto: PlaceOrderDto): Promise<OrderEntity> {
    const merchant = await this.merchantsService.findById(dto.merchantId);
    if (!merchant.isOpen || !merchant.canReceiveOrders) {
      throw new BadRequestException('MERCHANT_NOT_ACCEPTING');
    }

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
      item.price = Number(dbProduct.price);
      item.productName = dbProduct.name;
      item.productNameAr = dbProduct.nameAr;
    }

    const subtotal = dto.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // ✅ Calculate delivery fee server-side
    const { fee: deliveryFee } = this.deliveryFeeService.calculateFee(
      merchant.latitude,
      merchant.longitude,
      dto.deliveryLatitude,
      dto.deliveryLongitude,
      subtotal,
    );

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

    const total = Math.max(subtotal - discount + deliveryFee, 0);

    // Calculate dynamic commissions
    const merchantCommission = (subtotal * Number(merchant.commissionRate || 0)) / 100;
    const driverCommission = PLATFORM_DRIVER_COMMISSION;

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
          deliveryFee,
          total,
          discount,
          paymentMethod: dto.paymentMethod,
          isPaid: dto.paymentMethod === PaymentMethod.WALLET,
          merchantCommission,
          driverCommission,
          commissionsDeducted: false,
          deliveryAddress: dto.deliveryAddress,
          deliveryLatitude: dto.deliveryLatitude,
          deliveryLongitude: dto.deliveryLongitude,
          deliveryPhone: dto.deliveryPhone,
          deliveryNotes: dto.deliveryNotes,
          deliverAt: dto.deliverAt ? new Date(dto.deliverAt) : undefined,
        });
        const saved = await manager.save(order);

        if (dto.paymentMethod === PaymentMethod.WALLET) {
          await this.walletService.debitWallet(
            customerId,
            total,
            TransactionReason.ORDER_PAYMENT,
            `Payment for order ${orderNumber}`,
            saved.id,
            manager,
          );
        }

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

        await this.createOrderEvent(manager, saved.id, OrderStatus.PENDING, 'Order Placed', 'تم إنشاء الطلب');

        return manager.findOne(OrderEntity, {
          where: { id: saved.id },
          relations: ['items'],
        }) as Promise<OrderEntity>;
      })
      .then((order) => {
        if (order.merchantId) {
          this.gatewayService.notifyNewOrder(order.merchantId, order);
          void this.orderNotifications.notifyMerchantNewOrder(order).catch(() => {});
        }
        
        // Broadcast to all online drivers
        this.gatewayService.broadcastToDrivers(SOCKET_EVENTS.ORDER_NEW, order);
        
        if (dto.promoCode) {
          void this.promoService.markUsed(dto.promoCode).catch(() => {});
        }
        return order;
      });
  }

  // ── Customer: place custom order ───────────────────────────────────
  async placeCustomOrder(customerId: string, dto: PlaceCustomOrderDto): Promise<OrderEntity> {
    // If shop coordinates are provided:
    let deliveryFee = dto.deliveryFee;
    if (dto.shopLatitude && dto.shopLongitude) {
      const { fee } = this.deliveryFeeService.calculateFee(
        dto.shopLatitude,
        dto.shopLongitude,
        dto.deliveryLatitude,
        dto.deliveryLongitude,
        dto.estimatedBudget,
      );
      deliveryFee = fee;
    }

    const total = dto.estimatedBudget + deliveryFee;

    const driverCommission = PLATFORM_DRIVER_COMMISSION;

    const orderNumber = await this.orderNumberService.generate();

    return this.dataSource.transaction(async (manager) => {
      const order = manager.create(OrderEntity, {
        orderNumber,
        customerId,
        type: OrderType.CUSTOM,
        status: OrderStatus.PENDING,
        subtotal: dto.estimatedBudget,
        deliveryFee,
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
        driverCommission,
        commissionsDeducted: false,
        deliveryAddress: dto.deliveryAddress,
        deliveryLatitude: dto.deliveryLatitude,
        deliveryLongitude: dto.deliveryLongitude,
        deliveryPhone: dto.deliveryPhone,
        deliverAt: dto.deliverAt ? new Date(dto.deliverAt) : undefined,
      });
      const saved = await manager.save(order);

      if (dto.paymentMethod === PaymentMethod.WALLET) {
        await this.walletService.debitWallet(
          customerId,
          total,
          TransactionReason.ORDER_PAYMENT,
          `Custom order ${orderNumber}`,
          saved.id,
          manager,
        );
      }

      await this.createOrderEvent(manager, saved.id, OrderStatus.PENDING, 'Custom Order Placed', 'تم إنشاء طلب خاص');

      return saved;
    });
  }

  // ── Customer: get my orders ────────────────────────────────────────
  async getCustomerOrders(customerId: string, limit = 50, offset = 0): Promise<OrderEntity[]> {
    return this.orderRepo.find({
      where: { customerId },
      relations: ['items', 'merchant'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  // ── Merchant: get orders ───────────────────────────────────────────
  async getMerchantOrders(userId: string, limit = 50, offset = 0): Promise<OrderEntity[]> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');
    return this.orderRepo.find({
      where: { merchantId: merchant.id },
      relations: ['items'],
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  // ── Merchant: accept order ─────────────────────────────────────────
  async merchantAccept(orderId: string, userId: string, prepMinutes: number): Promise<OrderEntity> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');

    const order = await this.getOrderById(orderId);
    if (order.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_MANAGE_ORDER');
    }

    // Determine target status
    const targetStatus = order.status === OrderStatus.DRIVER_ASSIGNED 
      ? OrderStatus.DRIVER_ASSIGNED 
      : OrderStatus.ACCEPTED;

    const updated = await this.transitionTo(orderId, targetStatus, userId);

    // Side effect: Try assigning driver if not already assigned
    if (!updated.driverId && updated.deliveryLatitude && updated.deliveryLongitude) {
      const searchLat = updated.merchant?.latitude ?? updated.deliveryLatitude;
      const searchLng = updated.merchant?.longitude ?? updated.deliveryLongitude;
      const nearestDriver = await this.driversService.findNearestOnlineDriver(
        searchLat,
        searchLng,
        5,
      );

      if (nearestDriver) {
        return this.transitionTo(orderId, OrderStatus.DRIVER_ASSIGNED, 'SYSTEM', {
          driverId: nearestDriver.userId,
        });
      }
    }

    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, updated.status, updated);
      void this.orderNotifications
        .notifyCustomerStatusChange(updated, '✅ قبل المحل طلبك — جاري التحضير')
        .catch(() => {});
        
      if (updated.driverId) {
        void this.orderNotifications.notifyCustomerDriverAssigned(updated).catch(() => {});
        this.gatewayService.notifyDriverAssigned(orderId, updated.customerId, updated.driver);
      }
    }

    return updated;
  }

  // ── Merchant: reject order ─────────────────────────────────────────
  async merchantReject(orderId: string, userId: string, reason: string): Promise<OrderEntity> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');

    const order = await this.getOrderById(orderId);
    if (order.merchantId !== merchant.id) {
      throw new ForbiddenException('CANNOT_MANAGE_ORDER');
    }

    const updated = await this.transitionTo(orderId, OrderStatus.REJECTED, userId, {}, { reason });

    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.REJECTED, updated);
      void this.orderNotifications.notifyCustomerOrderRejected(updated).catch(() => {});
    }
    return updated;
  }

  // ── Merchant: mark ready ───────────────────────────────────────────
  async merchantMarkReady(orderId: string, userId: string): Promise<OrderEntity> {
    const merchant = await this.merchantsService.findByUserId(userId);
    if (!merchant) throw new ForbiddenException('NOT_A_MERCHANT');

    const order = await this.getOrderById(orderId);
    if (order.merchantId !== merchant.id) {
      throw new ForbiddenException('ACCESS_DENIED');
    }

    const updated = await this.transitionTo(orderId, OrderStatus.READY, userId);

    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, OrderStatus.READY, updated);
      void this.orderNotifications
        .notifyCustomerStatusChange(updated, '✅ طلبك جاهز للاستلام')
        .catch(() => {});
    }
    return updated;
  }

  // ── Driver: accept order ───────────────────────────────────────────
  async driverAccept(orderId: string, driverId: string): Promise<OrderEntity> {
    // If order already has a driver, throw
    const order = await this.getOrderById(orderId);
    if (order.driverId) {
      throw new BadRequestException('ORDER_ALREADY_TAKEN');
    }

    const updated = await this.transitionTo(orderId, OrderStatus.DRIVER_ASSIGNED, driverId, {
      driverId,
    });

    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, updated.status, updated);
      void this.orderNotifications.notifyCustomerDriverAssigned(updated).catch(() => {});
    }
    return updated;
  }

  // ── Driver: decline order ──────────────────────────────────────────
  async driverDecline(orderId: string, driverId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    if (order.driverId === driverId) {
      // 1. Reset order driver association
      await this.orderRepo.update(orderId, {
        driverId: null,
        status: OrderStatus.READY, // Fallback to ready for assignment
        assignedAt: null,
      });

      // 2. Log audit event
      await this.createOrderEvent(
        this.orderRepo.manager,
        orderId,
        OrderStatus.READY,
        'Driver Declined',
        'رفض السائق الطلب',
      );

      // 3. Trigger immediate re-assignment attempt
      if (order.merchant?.latitude && order.merchant?.longitude) {
        const searchLat = order.merchant.latitude;
        const searchLng = order.merchant.longitude;

        const nextDriver = await this.driversService.findNearestOnlineDriver(
          searchLat,
          searchLng,
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

  /**
   * Centralized state machine execution.
   * Performs locking, validation, side-effects, and persistence atomically.
   */
  async transitionTo(
    orderId: string,
    nextStatus: OrderStatus,
    actorId?: string, // user performing the action
    additionalData: Partial<OrderEntity> = {},
    metadata: Record<string, any> = {},
  ): Promise<OrderEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Fetch order with PESSIMISTIC_WRITE lock
      // This prevents multiple actors (e.g. two drivers) from changing status concurrently
      const order = await manager.findOne(OrderEntity, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' },
        relations: ['merchant', 'customer', 'driver'],
      });

      if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

      // 2. Validate transition
      validateOrderTransition(order.status, nextStatus);

      // Race condition check: Ensure driver isn't already assigned to someone else
      if (nextStatus === OrderStatus.DRIVER_ASSIGNED && order.driverId && order.driverId !== actorId) {
        throw new BadRequestException('ORDER_ALREADY_ASSIGNED');
      }

      // 3. Status-specific side effects
      const updateData: Partial<OrderEntity> = { status: nextStatus, ...additionalData };

      // REJECTED or CANCELLED -> Handle Refunds
      if ((nextStatus === OrderStatus.REJECTED || nextStatus === OrderStatus.CANCELLED) && order.isPaid) {
        // Refund if paid via wallet
        if (order.paymentMethod === PaymentMethod.WALLET) {
          await this.walletService.creditWallet(
            order.customerId,
            Number(order.total),
            TransactionReason.REFUND,
            `Refund: Order ${order.orderNumber} ${nextStatus.toLowerCase()}`,
            order.id,
            manager,
            `REFUND_${order.id}_${nextStatus}`
          );
        }
        updateData.cancelledAt = new Date();
      }

      // ACCEPTED
      if (nextStatus === OrderStatus.ACCEPTED) {
        updateData.acceptedAt = new Date();
      }

      // DRIVER_ASSIGNED
      if (nextStatus === OrderStatus.DRIVER_ASSIGNED) {
        updateData.assignedAt = new Date();
      }

      // IN_TRANSIT (Picked up)
      if (nextStatus === OrderStatus.IN_TRANSIT && !order.pickedUpAt) {
        updateData.pickedUpAt = new Date();
      }

      // DELIVERED
      if (nextStatus === OrderStatus.DELIVERED) {
        updateData.deliveredAt = new Date();
      }

      // COMPLETED -> Finalize Payments
      if (nextStatus === OrderStatus.COMPLETED) {
        updateData.completedAt = new Date();
        if (!order.commissionsDeducted) {
          await this.finalizePayments(order, manager);
          updateData.commissionsDeducted = true;
        }
      }

      // 4. Persistence
      await manager.update(OrderEntity, orderId, updateData as any);
      
      // 5. Audit Trail
      await this.createOrderEvent(
        manager,
        orderId,
        nextStatus,
        `Status change to ${nextStatus}`,
        `تغيير الحالة إلى ${nextStatus}`,
        { ...metadata, actorId }
      );

      return manager.findOne(OrderEntity, {
        where: { id: orderId },
        relations: ['items', 'merchant', 'driver', 'driver.user', 'customer'],
      }) as Promise<OrderEntity>;
    });
  }

  private validateStatusTransition(current: OrderStatus, next: OrderStatus) {
    // Deprecated in favor of orders.state-machine.ts
    validateOrderTransition(current, next);
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

    if (order.status === dto.status) {
      return order; // Idempotency
    }

    const additionalData: Partial<OrderEntity> = {};
    if (dto.status === OrderStatus.IN_TRANSIT) {
      if (dto.actualAmount !== undefined) additionalData.actualAmount = dto.actualAmount;
      if (dto.receiptImage) additionalData.receiptImage = dto.receiptImage;
    }

    const updated = await this.transitionTo(orderId, dto.status, driverId, additionalData);

    if (updated.customerId) {
      this.gatewayService.notifyOrderStatusChanged(orderId, dto.status, updated);
      if (dto.status === OrderStatus.IN_TRANSIT) {
        void this.orderNotifications.notifyCustomerStatusChange(updated, '🛵 طلبك في الطريق إليك').catch(() => {});
      }
      if (dto.status === OrderStatus.COMPLETED) {
        void this.orderNotifications.notifyCustomerStatusChange(updated, '✅ تم توصيل طلبك بنجاح').catch(() => {});
      }
    }
    return updated;
  }

  // ── Customer: cancel order ──────────────────────────────────────────
  async customerCancel(orderId: string, customerId: string, isAdmin = false): Promise<OrderEntity> {
    const order = await this.getOrderById(orderId);
    if (!isAdmin && order.customerId !== customerId) throw new ForbiddenException('NOT_YOUR_ORDER');
    
    // Policy: Customers can only cancel while PENDING
    if (order.status !== OrderStatus.PENDING && !isAdmin) {
      throw new BadRequestException('CAN_ONLY_CANCEL_PENDING');
    }

    const updated = await this.transitionTo(orderId, OrderStatus.CANCELLED, customerId);

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

  async findAllForAdmin(status?: string, limit = 50, offset = 0): Promise<{ data: OrderEntity[], total: number }> {
    const query = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.merchant', 'merchant')
      .leftJoinAndSelect('order.driver', 'driver')
      .leftJoinAndSelect('order.items', 'items');

    if (status === 'active') {
      query.where('order.status IN (:...statuses)', {
        statuses: [
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.DRIVER_ASSIGNED,
          OrderStatus.AT_SHOP,
          OrderStatus.SHOPPING,
          OrderStatus.PURCHASED,
          OrderStatus.PICKED_UP,
          OrderStatus.IN_TRANSIT,
          OrderStatus.DELIVERED,
        ]
      });
    }

    const [data, total] = await query
      .orderBy('order.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
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

    await this.dataSource.transaction(async (manager) => {
      await this.walletService.debitWallet(
        customerId,
        amount,
        TransactionReason.TIP,
        `Tip for order ${order.orderNumber}`,
        orderId,
        manager,
        `TIP_DEBIT_${orderId}_${amount}_${Date.now()}` // Allow multiple tips but prevent strict concurrency dupes
      );

      if (order.driverId) {
        await this.walletService.creditWallet(
          order.driverId,
          amount,
          TransactionReason.TIP,
          `Tip from customer for order ${order.orderNumber}`,
          orderId,
          manager,
          `TIP_CREDIT_${orderId}_${amount}_${Date.now()}`
        );
      }

      const currentTip = Number(order.tipAmount || 0);
      await manager.update(OrderEntity, orderId, { tipAmount: currentTip + amount });
    });

    return this.getOrderById(orderId);
  }

  private async finalizePayments(order: OrderEntity, manager: EntityManager): Promise<void> {
    // 1. Handle Credits (if paid via Wallet)
    if (order.paymentMethod === PaymentMethod.WALLET && order.isPaid) {
      if (order.type === OrderType.REGULAR && order.merchantId) {
        // Regular Order: Subtotal goes to Merchant
        const merchant = await this.merchantsService.findById(order.merchantId);
        await this.walletService.creditWallet(
          merchant.userId,
          Number(order.subtotal),
          TransactionReason.ORDER_PAYMENT,
          `Payment for items in order ${order.orderNumber}`,
          order.id,
          manager,
          `ORDER_PAYMENT_MERCHANT_${order.id}`
        );

        // Delivery Fee goes to Driver
        if (order.driverId) {
          await this.walletService.creditWallet(
            order.driverId,
            Number(order.deliveryFee),
            TransactionReason.DELIVERY_FEE,
            `Delivery fee for order ${order.orderNumber}`,
            order.id,
            manager,
            `ORDER_DELIVERY_FEE_DRIVER_${order.id}`
          );
        }
      } else if (order.type === OrderType.CUSTOM && order.driverId) {
        // Custom Order: Total (Budget + Fee) goes to Driver
        // (Driver is responsible for buying items)
        await this.walletService.creditWallet(
          order.driverId,
          Number(order.total),
          TransactionReason.ORDER_PAYMENT,
          `Custom order payment (Budget + Fee) for ${order.orderNumber}`,
          order.id,
          manager,
          `CUSTOM_ORDER_PAYMENT_DRIVER_${order.id}`
        );
      }
    }

    // 2. Handle Debits (Commissions)
    if (order.merchantId && Number(order.merchantCommission) > 0) {
      const merchant = await this.merchantsService.findById(order.merchantId);
      await this.walletService.debitWallet(
        merchant.userId,
        Number(order.merchantCommission),
        TransactionReason.COMMISSION_DEDUCTION,
        `Merchant commission for order ${order.orderNumber}`,
        order.id,
        manager,
        `COMMISSION_MERCHANT_${order.id}`
      );
    }

    if (order.driverId && Number(order.driverCommission) > 0) {
      await this.walletService.debitWallet(
        order.driverId,
        Number(order.driverCommission),
        TransactionReason.COMMISSION_DEDUCTION,
        `Driver commission for order ${order.orderNumber}`,
        order.id,
        manager,
        `COMMISSION_DRIVER_${order.id}`
      );
    }
  }
}

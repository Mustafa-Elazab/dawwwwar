import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { MerchantEntity } from './merchant.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  AT_SHOP = 'AT_SHOP',
  SHOPPING = 'SHOPPING',
  PURCHASED = 'PURCHASED',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum OrderType {
  REGULAR = 'REGULAR',
  CUSTOM = 'CUSTOM',
}

export enum PaymentMethod {
  CASH = 'CASH',
  WALLET = 'WALLET',
}

@Entity('orders')
@Index(['customerId'])
@Index(['merchantId'])
@Index(['driverId'])
@Index(['status'])
export class OrderEntity extends BaseEntity {
  @Column({ name: 'order_number', unique: true })
  orderNumber: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserEntity;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => MerchantEntity, { nullable: true })
  @JoinColumn({ name: 'merchant_id' })
  merchant?: MerchantEntity;

  @Column({ name: 'merchant_id', nullable: true })
  merchantId?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: UserEntity;

  @Column({ name: 'driver_id', nullable: true })
  driverId?: string;

  @Column({ type: 'enum', enum: OrderType, default: OrderType.REGULAR })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'delivery_fee', type: 'decimal', precision: 10, scale: 2 })
  deliveryFee: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ name: 'payment_method', type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ name: 'is_paid', default: false })
  isPaid: boolean;

  // Custom order fields
  @Column({ name: 'shop_name', nullable: true })
  shopName?: string;

  @Column({ name: 'shop_address', nullable: true })
  shopAddress?: string;

  @Column({ name: 'shop_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  shopLatitude?: number;

  @Column({ name: 'shop_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  shopLongitude?: number;

  @Column({ name: 'items_description', type: 'text', nullable: true })
  itemsDescription?: string;

  @Column({ name: 'items_voice_note', nullable: true })
  itemsVoiceNote?: string;

  @Column({ name: 'items_images', type: 'text', array: true, nullable: true })
  itemsImages?: string[];

  @Column({ name: 'estimated_budget', type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedBudget?: number;

  @Column({ name: 'actual_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualAmount?: number;

  @Column({ name: 'receipt_image', nullable: true })
  receiptImage?: string;

  // Delivery
  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ name: 'delivery_latitude', type: 'decimal', precision: 10, scale: 7 })
  deliveryLatitude: number;

  @Column({ name: 'delivery_longitude', type: 'decimal', precision: 10, scale: 7 })
  deliveryLongitude: number;

  @Column({ name: 'delivery_phone' })
  deliveryPhone: string;

  @Column({ name: 'delivery_notes', type: 'text', nullable: true })
  deliveryNotes?: string;

  // Commissions
  @Column({ name: 'merchant_commission', type: 'decimal', precision: 10, scale: 2, default: 0 })
  merchantCommission: number;

  @Column({ name: 'driver_commission', type: 'decimal', precision: 10, scale: 2, default: 0 })
  driverCommission: number;

  @Column({ name: 'commissions_deducted', default: false })
  commissionsDeducted: boolean;

  // Timestamps
  @Column({ name: 'accepted_at', type: 'timestamptz', nullable: true })
  acceptedAt?: Date;

  @Column({ name: 'assigned_at', type: 'timestamptz', nullable: true })
  assignedAt?: Date;

  @Column({ name: 'picked_up_at', type: 'timestamptz', nullable: true })
  pickedUpAt?: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt?: Date;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt?: Date;

  // Scheduled order — null means deliver ASAP
  @Column({ name: 'deliver_at', type: 'timestamptz', nullable: true })
  deliverAt?: Date;

  // Tip — optional amount added to driver wallet on COMPLETED
  @Column({ name: 'tip_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  tipAmount: number;

  @OneToMany('OrderItemEntity', 'order', { cascade: true })
  items: unknown[];
}

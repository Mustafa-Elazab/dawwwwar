import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';
import { TicketMessageEntity } from './ticket-message.entity';

export enum TicketType {
  WRONG_ITEM = 'WRONG_ITEM',
  MISSING_ITEM = 'MISSING_ITEM',
  DAMAGED_ITEM = 'DAMAGED_ITEM',
  DRIVER_NO_SHOW = 'DRIVER_NO_SHOW',
  CUSTOMER_NO_SHOW = 'CUSTOMER_NO_SHOW',
  PAYMENT_ISSUE = 'PAYMENT_ISSUE',
  PAYOUT_ISSUE = 'PAYOUT_ISSUE',
  CHAT_ABUSE = 'CHAT_ABUSE',
  ACCOUNT_BAN_APPEAL = 'ACCOUNT_BAN_APPEAL',
  GENERAL = 'GENERAL',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  WAITING_RESPONSE = 'WAITING_RESPONSE',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('support_tickets')
export class SupportTicketEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  @Index()
  @Column({ name: 'order_id', nullable: true })
  orderId?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'customer_id' })
  customer: UserEntity;

  @Index()
  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'driver_id', nullable: true })
  driverId?: string;

  @Column({ name: 'merchant_id', nullable: true })
  merchantId?: string;

  @Column({ type: 'enum', enum: TicketType, default: TicketType.GENERAL })
  type: TicketType;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @Column({ name: 'assigned_admin_id', nullable: true })
  assignedAdminId?: string;

  @Column({ type: 'timestamptz', nullable: true })
  resolvedAt?: Date;

  @OneToMany(() => TicketMessageEntity, (msg) => msg.ticket)
  messages: TicketMessageEntity[];
}

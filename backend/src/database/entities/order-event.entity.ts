import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity, OrderStatus } from './order.entity';

@Entity('order_events')
export class OrderEventEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Index()
  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  titleAr: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}

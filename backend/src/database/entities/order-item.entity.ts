import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';

@Entity('order_items')
export class OrderItemEntity extends BaseEntity {
  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'product_id', nullable: true })
  productId?: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'product_name_ar', nullable: true })
  productNameAr?: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  notes?: string;
}

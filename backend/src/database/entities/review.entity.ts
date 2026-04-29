import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { MerchantEntity } from './merchant.entity';
import { DriverProfileEntity } from './driver-profile.entity';
import { OrderEntity } from './order.entity';

@Entity('reviews')
export class ReviewEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index({ unique: true })           // one review per order
  orderId: string;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'uuid', nullable: true })
  merchantId: string | null;

  @Column({ type: 'uuid', nullable: true })
  driverId: string | null;

  @Column({ type: 'smallint' })
  rating: number;                    // 1-5

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  // ── Relations ────────────────────────────────────────────────────
  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: OrderEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: UserEntity;

  @ManyToOne(() => MerchantEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'merchantId' })
  merchant: MerchantEntity | null;

  @ManyToOne(() => DriverProfileEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'driverId' })
  driver: DriverProfileEntity | null;
}

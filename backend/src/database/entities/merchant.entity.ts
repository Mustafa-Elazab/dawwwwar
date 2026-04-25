import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export interface DayHours {
  open: string;
  close: string;
}

export interface OpeningHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

@Entity('merchants')
export class MerchantEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'business_name' })
  businessName: string;

  @Column()
  category: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7 })
  longitude: number;

  @Column({ name: 'is_open', default: true })
  isOpen: boolean;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'can_receive_orders', default: true })
  canReceiveOrders: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0.0 })
  rating: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings: number;

  @Column({ name: 'delivery_time_min', default: 15 })
  deliveryTimeMin: number;

  @Column({ name: 'delivery_time_max', default: 30 })
  deliveryTimeMax: number;

  @Column({ nullable: true })
  logo?: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage?: string;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 10, scale: 2, default: 5 })
  commissionRate: number;

  @Column({ name: 'opening_hours', type: 'jsonb', nullable: true })
  openingHours: OpeningHours;

  @Column({
    name: 'location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
    select: false,
  })
  location?: string;
}

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
}

@Entity('driver_profiles')
export class DriverProfileEntity extends BaseEntity {
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'vehicle_type', type: 'enum', enum: VehicleType, default: VehicleType.MOTORCYCLE })
  vehicleType: VehicleType;

  @Column({ name: 'vehicle_plate', nullable: true })
  vehiclePlate?: string;

  @Column({ name: 'is_online', default: false })
  isOnline: boolean;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'can_receive_orders', default: true })
  canReceiveOrders: boolean;

  @Column({ name: 'current_latitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLatitude?: number;

  @Column({ name: 'current_longitude', type: 'decimal', precision: 10, scale: 7, nullable: true })
  currentLongitude?: number;

  @Column({ name: 'last_location_update', type: 'timestamptz', nullable: true })
  lastLocationUpdate?: Date;

  @Column({ type: 'decimal', precision: 3, scale: 1, default: 0.0 })
  rating: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings: number;

  @Column({ name: 'total_deliveries', default: 0 })
  totalDeliveries: number;

  @Column({ name: 'commission_rate', type: 'decimal', precision: 10, scale: 2, default: 5 })
  commissionRate: number;

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

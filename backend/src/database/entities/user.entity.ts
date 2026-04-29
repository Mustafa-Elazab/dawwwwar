import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

@Entity('users')
@Index(['phone'], { unique: true })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  phone: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ name: 'profile_image', nullable: true })
  profileImage?: string;

  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @Column({ name: 'fcm_token', nullable: true })
  fcmToken?: string;

  // Refresh token (hashed)
  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;
}

import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum DiscountType {
  PERCENT = 'PERCENT',
  FIXED = 'FIXED',
}

@Entity('promo_codes')
export class PromoCodeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 32 })
  @Index({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: DiscountType, default: DiscountType.FIXED })
  discountType: DiscountType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({ type: 'int', default: 0 })    // 0 = unlimited
  maxUses: number;

  @Column({ type: 'int', default: 0 })
  usedCount: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}

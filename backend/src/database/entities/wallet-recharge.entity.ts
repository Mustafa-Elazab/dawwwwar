import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export enum WalletRechargeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('wallet_recharges')
@Index(['userId'])
@Index(['paymobOrderId'], { unique: true })
export class WalletRechargeEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'paymob_order_id' })
  paymobOrderId: string;

  @Column({ name: 'paymob_transaction_id', nullable: true })
  paymobTransactionId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'EGP' })
  currency: string;

  @Column({ type: 'enum', enum: WalletRechargeStatus, default: WalletRechargeStatus.PENDING })
  status: WalletRechargeStatus;

  @Column({ name: 'payment_key', type: 'text', nullable: true })
  paymentKey?: string;

  @Column({ name: 'checkout_url', type: 'text', nullable: true })
  checkoutUrl?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;
}

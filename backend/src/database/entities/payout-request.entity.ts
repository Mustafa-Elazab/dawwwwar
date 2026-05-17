import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';

export enum PayoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
}

export enum PayoutMethod {
  PAYMOB_BANK = 'PAYMOB_BANK',
  PAYMOB_WALLET = 'PAYMOB_WALLET',
}

@Entity('payout_requests')
export class PayoutRequestEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Index()
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PayoutStatus, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  @Column({ type: 'enum', enum: PayoutMethod })
  method: PayoutMethod;

  @Column({ name: 'external_tx_id', nullable: true })
  externalTransactionId?: string;

  @Column({ name: 'rejection_reason', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'jsonb', nullable: true })
  paymentDetails?: Record<string, any>;
}

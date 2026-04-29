import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WalletEntity } from './wallet.entity';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionReason {
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  COMMISSION_DEDUCTION = 'COMMISSION_DEDUCTION',
  WALLET_RECHARGE = 'WALLET_RECHARGE',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  TIP = 'TIP',
}

@Entity('wallet_transactions')
@Index(['walletId'])
export class WalletTransactionEntity extends BaseEntity {
  @ManyToOne(() => WalletEntity)
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @Column({ name: 'wallet_id' })
  walletId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: TransactionReason })
  reason: TransactionReason;

  @Column({ name: 'order_id', nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ name: 'balance_before', type: 'decimal', precision: 12, scale: 2 })
  balanceBefore: number;

  @Column({ name: 'balance_after', type: 'decimal', precision: 12, scale: 2 })
  balanceAfter: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;
}

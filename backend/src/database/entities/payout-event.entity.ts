import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PayoutRequestEntity, PayoutStatus } from './payout-request.entity';

@Entity('payout_events')
export class PayoutEventEntity extends BaseEntity {
  @ManyToOne(() => PayoutRequestEntity)
  @JoinColumn({ name: 'payout_request_id' })
  payoutRequest: PayoutRequestEntity;

  @Index()
  @Column({ name: 'payout_request_id' })
  payoutRequestId: string;

  @Column({ type: 'enum', enum: PayoutStatus })
  status: PayoutStatus;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;
}

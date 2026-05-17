import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SupportTicketEntity } from './support-ticket.entity';

@Entity('dispute_resolutions')
export class DisputeResolutionEntity extends BaseEntity {
  @OneToOne(() => SupportTicketEntity)
  @JoinColumn({ name: 'ticket_id' })
  ticket: SupportTicketEntity;

  @Index()
  @Column({ name: 'ticket_id' })
  ticketId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  compensationAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  penaltyAmount: number;

  @Column({ type: 'text' })
  finalDecision: string;

  @Column({ name: 'applied_at', type: 'timestamptz', nullable: true })
  appliedAt?: Date;
}

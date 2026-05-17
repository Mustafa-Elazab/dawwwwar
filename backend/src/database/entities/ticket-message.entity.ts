import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { SupportTicketEntity } from './support-ticket.entity';
import { UserRole } from './user.entity';

export enum TicketMessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

@Entity('ticket_messages')
export class TicketMessageEntity extends BaseEntity {
  @ManyToOne(() => SupportTicketEntity, (ticket) => ticket.messages)
  @JoinColumn({ name: 'ticket_id' })
  ticket: SupportTicketEntity;

  @Index()
  @Column({ name: 'ticket_id' })
  ticketId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ type: 'enum', enum: UserRole })
  senderRole: UserRole;

  @Column({ type: 'enum', enum: TicketMessageType, default: TicketMessageType.TEXT })
  type: TicketMessageType;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl?: string;

  @Column({ name: 'is_internal', default: false })
  isInternal: boolean;
}

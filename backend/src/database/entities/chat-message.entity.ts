import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum SenderRole {
  CUSTOMER = 'CUSTOMER',
  DRIVER = 'DRIVER',
  MERCHANT = 'MERCHANT',
}

@Entity('chat_messages')
export class ChatMessageEntity extends BaseEntity {
  @Column({ type: 'uuid' })
  @Index()
  orderId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'enum', enum: SenderRole })
  senderRole: SenderRole;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;
}

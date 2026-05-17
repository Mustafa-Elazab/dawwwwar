import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { MessageEntity } from './message.entity';

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

@Entity('conversations')
export class ConversationEntity extends BaseEntity {
  @OneToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'enum', enum: ConversationStatus, default: ConversationStatus.ACTIVE })
  status: ConversationStatus;

  @Column({ name: 'last_message_at', type: 'timestamptz', nullable: true })
  lastMessageAt?: Date;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: MessageEntity[];
}

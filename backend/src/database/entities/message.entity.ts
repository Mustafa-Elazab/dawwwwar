import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ConversationEntity } from './conversation.entity';
import { UserRole } from './user.entity';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VOICE = 'VOICE',
  SYSTEM_EVENT = 'SYSTEM_EVENT',
}

@Entity('chat_messages_v2') // Using v2 to distinguish from initial partial implementation
export class MessageEntity extends BaseEntity {
  @ManyToOne(() => ConversationEntity, (conv) => conv.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: ConversationEntity;

  @Index()
  @Column({ name: 'conversation_id' })
  conversationId: string;

  @Column({ name: 'sender_id' })
  senderId: string;

  @Column({ type: 'enum', enum: UserRole })
  senderRole: UserRole;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ name: 'media_url', nullable: true })
  mediaUrl?: string;

  @Index()
  @Column({ name: 'client_message_id', unique: true })
  clientMessageId: string;

  @Column({ name: 'sequence_number' })
  sequenceNumber: number;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ConversationEntity,
  MessageEntity,
  MessageType,
  OrderEntity,
  UserEntity,
  UserRole,
} from '../../database/entities';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly convRepo: Repository<ConversationEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Finds or creates a conversation for an order.
   * Validates that the requesting user is a participant (Customer, Driver, or Merchant).
   */
  async getOrCreateConversation(orderId: string, user: UserEntity): Promise<ConversationEntity> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('ORDER_NOT_FOUND');

    // 1. Participant Validation
    const isParticipant =
      order.customerId === user.id ||
      order.driverId === user.id ||
      (order.merchantId && (await this.isMerchantUser(order.merchantId, user.id)));

    if (!isParticipant && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('NOT_A_PARTICIPANT');
    }

    // 2. Find or Create
    let conversation = await this.convRepo.findOne({ where: { orderId } });
    if (!conversation) {
      conversation = this.convRepo.create({ orderId });
      conversation = await this.convRepo.save(conversation);
    }

    return conversation;
  }

  async getMessages(conversationId: string, limit = 50): Promise<MessageEntity[]> {
    return this.messageRepo.find({
      where: { conversationId },
      order: { sequenceNumber: 'DESC' },
      take: limit,
    });
  }

  /**
   * Saves a new message with idempotency and ordering guarantees.
   */
  async sendMessage(
    conversationId: string,
    sender: UserEntity,
    payload: {
      type: MessageType;
      content?: string;
      mediaUrl?: string;
      clientMessageId: string;
    },
  ): Promise<MessageEntity> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Idempotency Check
      const existing = await manager.findOne(MessageEntity, {
        where: { clientMessageId: payload.clientMessageId },
      });
      if (existing) return existing;

      // 2. Lock conversation to get next sequence number
      const conversation = await manager.findOne(ConversationEntity, {
        where: { id: conversationId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!conversation) throw new NotFoundException('CONVERSATION_NOT_FOUND');

      // 3. Get latest sequence
      const lastMessage = await manager.findOne(MessageEntity, {
        where: { conversationId },
        order: { sequenceNumber: 'DESC' },
      });
      const nextSequence = (lastMessage?.sequenceNumber ?? 0) + 1;

      // 4. Create and Save Message
      const message = manager.create(MessageEntity, {
        conversationId,
        senderId: sender.id,
        senderRole: sender.role,
        type: payload.type,
        content: payload.content,
        mediaUrl: payload.mediaUrl,
        clientMessageId: payload.clientMessageId,
        sequenceNumber: nextSequence,
      });

      const saved = await manager.save(message);

      // 5. Update conversation heartbeat
      await manager.update(ConversationEntity, conversationId, {
        lastMessageAt: new Date(),
      });

      return saved;
    });
  }

  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await this.messageRepo
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .execute();
  }

  private async isMerchantUser(merchantId: string, userId: string): Promise<boolean> {
    // Basic check: in our system merchantId is linked to a userId via the merchant profile
    const merchant = await this.dataSource
      .getRepository('merchants')
      .findOne({ where: { id: merchantId, userId } });
    return !!merchant;
  }
}

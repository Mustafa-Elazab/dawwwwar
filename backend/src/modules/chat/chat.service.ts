import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessageEntity, SenderRole } from '../../database/entities/chat-message.entity';
import { OrderEntity } from '../../database/entities/order.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly chatRepo: Repository<ChatMessageEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async getHistory(orderId: string, requesterId: string): Promise<ChatMessageEntity[]> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');

    // Allow customer, driver, or merchant of this order
    const isAllowed =
      order.customerId === requesterId ||
      order.driverId === requesterId ||
      order.merchantId === requesterId;

    if (!isAllowed) throw new ForbiddenException('Not your order');

    return this.chatRepo.find({
      where: { orderId },
      order: { createdAt: 'ASC' },
      take: 200,
    });
  }

  async saveMessage(
    orderId: string,
    senderId: string,
    senderRole: SenderRole,
    message: string,
  ): Promise<ChatMessageEntity> {
    const msg = this.chatRepo.create({ orderId, senderId, senderRole, message });
    return this.chatRepo.save(msg);
  }

  async markRead(orderId: string, readerId: string): Promise<void> {
    await this.chatRepo
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where('orderId = :orderId AND senderId != :readerId AND isRead = false', {
        orderId,
        readerId,
      })
      .execute();
  }
}

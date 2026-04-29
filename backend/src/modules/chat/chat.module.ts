import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatMessageEntity } from '../../database/entities/chat-message.entity';
import { OrderEntity } from '../../database/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity, OrderEntity])],
  providers: [ChatService],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}

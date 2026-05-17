import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { ConversationEntity, MessageEntity, OrderEntity } from '../../database/entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity, OrderEntity]),
    AuthModule,
  ],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}

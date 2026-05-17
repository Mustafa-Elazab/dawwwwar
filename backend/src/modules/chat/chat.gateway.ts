import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtGuard } from '../gateway/ws-jwt.guard';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserEntity } from '../../database/entities/user.entity';
import { MessageType } from '../../database/entities/message.entity';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'chat',
})
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.logger.debug(`Client connected to chat: ${client.id}`);
  }

  @SubscribeMessage('CHAT_JOIN_CONVERSATION')
  async handleJoin(
    @MessageBody('orderId') orderId: string,
    @ConnectedSocket() client: Socket,
    @CurrentUser() user: UserEntity,
  ) {
    const conversation = await this.chatService.getOrCreateConversation(orderId, user);
    const room = `order:${orderId}`;
    
    await client.join(room);
    this.logger.log(`User ${user.id} joined room ${room}`);
    
    return { conversationId: conversation.id };
  }

  @SubscribeMessage('CHAT_SEND_MESSAGE')
  async handleSendMessage(
    @MessageBody() payload: {
      orderId: string;
      conversationId: string;
      type: MessageType;
      content?: string;
      mediaUrl?: string;
      clientMessageId: string;
    },
    @ConnectedSocket() client: Socket,
    @CurrentUser() user: UserEntity,
  ) {
    const message = await this.chatService.sendMessage(
      payload.conversationId,
      user,
      payload,
    );

    const room = `order:${payload.orderId}`;
    
    // Broadcast to the room (excluding sender if needed, but usually room-wide for sync)
    this.server.to(room).emit('CHAT_NEW_MESSAGE', message);
    
    return { success: true, messageId: message.id };
  }

  @SubscribeMessage('CHAT_TYPING_START')
  handleTypingStart(
    @MessageBody('orderId') orderId: string,
    @CurrentUser() user: UserEntity,
  ) {
    this.server.to(`order:${orderId}`).emit('CHAT_USER_TYPING', {
      userId: user.id,
      isTyping: true,
    });
  }

  @SubscribeMessage('CHAT_TYPING_STOP')
  handleTypingStop(
    @MessageBody('orderId') orderId: string,
    @CurrentUser() user: UserEntity,
  ) {
    this.server.to(`order:${orderId}`).emit('CHAT_USER_TYPING', {
      userId: user.id,
      isTyping: false,
    });
  }
}

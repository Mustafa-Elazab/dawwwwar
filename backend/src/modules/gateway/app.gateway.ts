import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';
import { SOCKET_EVENTS, Rooms } from './events';
import { GatewayService } from './gateway.service';
import { ChatService } from '../chat/chat.service';
import { SenderRole } from '../../database/entities/chat-message.entity';
import type { JwtPayload } from '../auth/jwt.strategy';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // restrict in production
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly gatewayService: GatewayService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.gatewayService.setServer(server);
    this.logger.log('WebSocket gateway initialized');
  }

  // ── Connection auth ───────────────────────────────────────────────
  handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth['token'] as string | undefined) ??
        (client.handshake.headers['authorization'] as string | undefined)?.replace('Bearer ', '');

      if (!token) {
        client.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.config.get<string>('jwt.accessSecret'),
      });

      client.data['user'] = payload;
      this.logger.log(`Client connected: ${client.id} (user: ${payload.sub})`);

      // Auto-join user's personal room
      void client.join(Rooms.customer(payload.sub));
    } catch {
      this.logger.warn(`Client disconnected (bad token): ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ── Join/Leave order room ─────────────────────────────────────────
  @SubscribeMessage(SOCKET_EVENTS.JOIN_ORDER_ROOM)
  handleJoinOrderRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { orderId: string }) {
    void client.join(Rooms.order(data.orderId));
    this.logger.debug(`${client.id} joined order room: ${data.orderId}`);
    return { joined: true, room: Rooms.order(data.orderId) };
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_ORDER_ROOM)
  handleLeaveOrderRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    void client.leave(Rooms.order(data.orderId));
    return { left: true };
  }

  // ── Join merchant room ────────────────────────────────────────────
  @SubscribeMessage(SOCKET_EVENTS.JOIN_MERCHANT_ROOM)
  handleJoinMerchantRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { merchantId: string },
  ) {
    void client.join(Rooms.merchant(data.merchantId));
    return { joined: true, room: Rooms.merchant(data.merchantId) };
  }

  // ── Driver location update ────────────────────────────────────────
  @SubscribeMessage(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE)
  handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { latitude: number; longitude: number; heading?: number; orderId?: string },
  ) {
    const user = client.data['user'] as JwtPayload | undefined;
    if (!user) throw new WsException('Not authenticated');

    // Broadcast to the active order room so the customer tracking map updates
    if (data.orderId) {
      this.server.to(Rooms.order(data.orderId)).emit(SOCKET_EVENTS.DRIVER_LOCATION, {
        orderId: data.orderId,
        driverId: user.sub,
        latitude: data.latitude,
        longitude: data.longitude,
        heading: data.heading,
        timestamp: Date.now(),
      });
    }

    // No ack needed — fire and forget
    return { received: true };
  }

  // ── Chat messages ─────────────────────────────────────────────────
  @SubscribeMessage(SOCKET_EVENTS.CHAT_SEND)
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string; message: string; senderRole: string },
  ) {
    const user = client.data['user'] as JwtPayload | undefined;
    if (!user) throw new WsException('Not authenticated');

    try {
      const savedMessage = await this.chatService.saveMessage(
        data.orderId,
        user.sub,
        data.senderRole as SenderRole,
        data.message,
      );

      // Broadcast to everyone in the order room (including the sender)
      this.server.to(Rooms.order(data.orderId)).emit(SOCKET_EVENTS.CHAT_MESSAGE, savedMessage);

      return { sent: true };
    } catch (err: unknown) {
      this.logger.error(`Failed to send chat message for order ${data.orderId}`, err);
      throw new WsException('Failed to send message');
    }
  }

  // ── Chat mark as read ─────────────────────────────────────────────
  @SubscribeMessage(SOCKET_EVENTS.CHAT_READ)
  async handleChatRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderId: string },
  ) {
    const user = client.data['user'] as JwtPayload | undefined;
    if (!user) throw new WsException('Not authenticated');

    try {
      await this.chatService.markRead(data.orderId, user.sub);
      return { read: true };
    } catch (err: unknown) {
      this.logger.error(`Failed to mark chat as read for order ${data.orderId}`, err);
      return { read: false };
    }
  }
}

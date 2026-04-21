import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SOCKET_EVENTS, Rooms } from './events';

/**
 * GatewayService is injected by other modules to emit real-time events.
 * It exposes the WebSocket server via AppGateway.
 */
@Injectable()
export class GatewayService {
  // Set by GatewayModule after AppGateway initializes
  private server: Server | null = null;

  setServer(server: Server) {
    this.server = server;
  }

  // ── Order events ──────────────────────────────────────────────────

  /** Notify merchant of a new incoming order */
  notifyNewOrder(merchantId: string, order: unknown) {
    this.server
      ?.to(Rooms.merchant(merchantId))
      .emit(SOCKET_EVENTS.ORDER_NEW, order);
    this.server
      ?.to(Rooms.merchant(merchantId))
      .emit(SOCKET_EVENTS.MERCHANT_ORDER_ALERT, { order });
  }

  /** Notify everyone in the order room of a status change */
  notifyOrderStatusChanged(orderId: string, status: string, order: unknown) {
    this.server
      ?.to(Rooms.order(orderId))
      .emit(SOCKET_EVENTS.ORDER_STATUS_CHANGED, { orderId, status, order });
  }

  /** Notify customer that a driver was assigned */
  notifyDriverAssigned(
    orderId: string,
    customerId: string,
    driver: unknown,
  ) {
    this.server
      ?.to(Rooms.customer(customerId))
      .emit(SOCKET_EVENTS.ORDER_DRIVER_ASSIGNED, { orderId, driver });
    this.server
      ?.to(Rooms.order(orderId))
      .emit(SOCKET_EVENTS.ORDER_DRIVER_ASSIGNED, { orderId, driver });
  }

  /** Push driver location to customer tracking screen */
  pushDriverLocation(
    orderId: string,
    driverId: string,
    latitude: number,
    longitude: number,
    heading?: number,
  ) {
    this.server
      ?.to(Rooms.order(orderId))
      .emit(SOCKET_EVENTS.DRIVER_LOCATION, {
        orderId,
        driverId,
        latitude,
        longitude,
        heading,
        timestamp: Date.now(),
      });
  }
}

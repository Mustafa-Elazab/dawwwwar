import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../../database/entities/order.entity';

export const ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [
    OrderStatus.ACCEPTED,
    OrderStatus.REJECTED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.ACCEPTED]: [
    OrderStatus.READY,
    OrderStatus.DRIVER_ASSIGNED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.READY]: [
    OrderStatus.DRIVER_ASSIGNED,
    OrderStatus.CANCELLED,
    OrderStatus.PICKED_UP, // Direct pickup if driver already at shop
  ],
  [OrderStatus.DRIVER_ASSIGNED]: [
    OrderStatus.AT_SHOP,
    OrderStatus.PICKED_UP,
    OrderStatus.READY, // If driver declines after being assigned
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.AT_SHOP]: [
    OrderStatus.SHOPPING,
    OrderStatus.PICKED_UP,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.SHOPPING]: [
    OrderStatus.PURCHASED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PURCHASED]: [
    OrderStatus.PICKED_UP,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.PICKED_UP]: [
    OrderStatus.IN_TRANSIT,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.IN_TRANSIT]: [
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ],
  [OrderStatus.DELIVERED]: [
    OrderStatus.COMPLETED,
    OrderStatus.CANCELLED, // Rare, but possible if customer disputes immediately
  ],
  [OrderStatus.COMPLETED]: [],
  [OrderStatus.REJECTED]: [],
  [OrderStatus.CANCELLED]: [],
};

/**
 * Validates if an order can move from current to next status.
 * Throws BadRequestException if transition is illegal.
 */
export function validateOrderTransition(current: OrderStatus, next: OrderStatus): void {
  if (current === next) return; // Idempotent

  const allowed = ORDER_TRANSITIONS[current] || [];
  if (!allowed.includes(next)) {
    throw new BadRequestException(
      `Illegal order status transition: ${current} -> ${next}`,
    );
  }
}

/**
 * Defines which statuses are considered "Final" (no more transitions allowed).
 */
export const FINAL_STATUSES = [
  OrderStatus.COMPLETED,
  OrderStatus.REJECTED,
  OrderStatus.CANCELLED,
];

/**
 * Defines which statuses allow customer cancellation.
 * Typically only allowed while PENDING or before MERCHANT_ACCEPTED (depending on policy).
 */
export const ALLOW_CUSTOMER_CANCEL = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
];

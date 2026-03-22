import { delay } from '../utils/delay';
import { mockOrders, getOrderById, getOrdersByCustomer } from '../db/orders';
import { generateOrderNumber } from '../utils/id';
import { OrderStatus, OrderType, PaymentMethod, ACTIVE_ORDER_STATUSES, TERMINAL_ORDER_STATUSES } from '@dawwar/types';
import type { ApiResponse, Order } from '@dawwar/types';

export const ordersMock = {
  getMyOrders: async (customerId: string): Promise<ApiResponse<Order[]>> => {
    await delay(600);
    return { success: true, data: getOrdersByCustomer(customerId) };
  },

  getActiveOrders: async (customerId: string): Promise<ApiResponse<Order[]>> => {
    await delay(400);
    const active = getOrdersByCustomer(customerId).filter((o) =>
      ACTIVE_ORDER_STATUSES.includes(o.status),
    );
    return { success: true, data: active };
  },

  getPastOrders: async (customerId: string): Promise<ApiResponse<Order[]>> => {
    await delay(400);
    const past = getOrdersByCustomer(customerId).filter((o) =>
      TERMINAL_ORDER_STATUSES.includes(o.status),
    );
    return { success: true, data: past };
  },

  getById: async (id: string): Promise<ApiResponse<Order>> => {
    await delay(400);
    const o = getOrderById(id);
    if (!o) throw Object.assign(new Error('NOT_FOUND'), { code: 'NOT_FOUND' });
    return { success: true, data: o };
  },

  placeOrder: async (
    payload: Pick<Order, 'customerId' | 'merchantId' | 'paymentMethod' | 'deliveryAddress' | 'deliveryLatitude' | 'deliveryLongitude' | 'deliveryPhone'> & {
      items: Array<{ productId: string; productName: string; quantity: number; price: number }>;
      subtotal: number;
      deliveryFee: number;
    },
  ): Promise<ApiResponse<Order>> => {
    await delay(1200);
    const newOrder: Order = {
      id: `order-mock-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      type: OrderType.REGULAR,
      status: OrderStatus.PENDING,
      customerId: payload.customerId,
      merchantId: payload.merchantId,
      subtotal: payload.subtotal,
      deliveryFee: payload.deliveryFee,
      total: payload.subtotal + payload.deliveryFee,
      discount: 0,
      paymentMethod: payload.paymentMethod,
      isPaid: payload.paymentMethod === PaymentMethod.WALLET,
      merchantCommission: 5,
      driverCommission: 5,
      commissionsDeducted: false,
      deliveryAddress: payload.deliveryAddress,
      deliveryLatitude: payload.deliveryLatitude,
      deliveryLongitude: payload.deliveryLongitude,
      deliveryPhone: payload.deliveryPhone,
      items: payload.items.map((item, i) => ({
        id: `oi-new-${i}`,
        orderId: `order-mock-${Date.now()}`,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { success: true, data: newOrder };
  },

  placeCustomOrder: async (
    payload: Pick<Order, 'customerId' | 'paymentMethod' | 'deliveryAddress' | 'deliveryLatitude' | 'deliveryLongitude' | 'deliveryPhone'> & {
      shopAddress: string;
      shopLatitude: number;
      shopLongitude: number;
      shopName?: string;
      itemsDescription?: string;
      estimatedBudget: number;
      deliveryFee: number;
    },
  ): Promise<ApiResponse<Order>> => {
    await delay(1200);
    const newOrder: Order = {
      id: `order-custom-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      type: OrderType.CUSTOM,
      status: OrderStatus.PENDING,
      customerId: payload.customerId,
      shopName: payload.shopName,
      shopAddress: payload.shopAddress,
      shopLatitude: payload.shopLatitude,
      shopLongitude: payload.shopLongitude,
      itemsDescription: payload.itemsDescription,
      estimatedBudget: payload.estimatedBudget,
      subtotal: payload.estimatedBudget,
      deliveryFee: payload.deliveryFee,
      total: payload.estimatedBudget + payload.deliveryFee,
      discount: 0,
      paymentMethod: payload.paymentMethod,
      isPaid: payload.paymentMethod === PaymentMethod.WALLET,
      merchantCommission: 0,
      driverCommission: 5,
      commissionsDeducted: false,
      deliveryAddress: payload.deliveryAddress,
      deliveryLatitude: payload.deliveryLatitude,
      deliveryLongitude: payload.deliveryLongitude,
      deliveryPhone: payload.deliveryPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { success: true, data: newOrder };
  },
};

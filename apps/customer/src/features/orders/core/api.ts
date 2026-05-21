import type { ApiResponse, Order } from '@dawwar/types';
import { ordersApi as ordersService } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realOrdersApi = {
  getMyOrders: async (customerId: string): Promise<ApiResponse<Order[]>> =>
    ordersService.getMyOrders(customerId),
  getById: async (id: string): Promise<ApiResponse<Order>> => ordersService.getById(id),
  placeOrder: async (payload: object): Promise<ApiResponse<Order>> => ordersService.placeOrder(payload),
  placeCustomOrder: async (payload: object): Promise<ApiResponse<Order>> =>
    ordersService.placeCustomOrder(payload),
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const ordersApi = realOrdersApi;

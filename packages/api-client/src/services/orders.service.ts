import { AxiosInstance } from 'axios';
import { ApiResponse, Order } from '@dawwar/types';
import {
  PlaceOrderDto,
  PlaceCustomOrderDto,
  AcceptOrderDto,
  RejectOrderDto,
  UpdateDeliveryStatusDto,
} from '../types/order.types';

export class OrdersService {
  constructor(private client: AxiosInstance) {}

  // ── Customer ────────────────────────────────────────────────────────

  async getMyOrders(): Promise<ApiResponse<Order[]>> {
    const { data } = await this.client.get('/orders/my');
    return data;
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.get(`/orders/${id}`);
    return data;
  }

  async placeOrder(orderData: PlaceOrderDto): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post('/orders', orderData);
    return data;
  }

  async placeCustomOrder(orderData: PlaceCustomOrderDto): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post('/orders/custom', orderData);
    return data;
  }

  async cancelOrder(id: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/${id}/cancel`);
    return data;
  }

  async addTip(id: string, amount: number): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/${id}/tip`, { amount });
    return data;
  }

  // ── Merchant ────────────────────────────────────────────────────────

  async getMerchantOrders(): Promise<ApiResponse<Order[]>> {
    const { data } = await this.client.get('/orders/merchant/all');
    return data;
  }

  async merchantAcceptOrder(id: string, payload: AcceptOrderDto): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/merchant/${id}/accept`, payload);
    return data;
  }

  async merchantRejectOrder(id: string, payload: RejectOrderDto): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/merchant/${id}/reject`, payload);
    return data;
  }

  async merchantMarkReady(id: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/merchant/${id}/ready`);
    return data;
  }

  // ── Driver ──────────────────────────────────────────────────────────

  async getAvailableOrders(): Promise<ApiResponse<Order[]>> {
    const { data } = await this.client.get('/orders/driver/available');
    return data;
  }

  async getActiveOrder(): Promise<ApiResponse<Order | null>> {
    const { data } = await this.client.get('/orders/driver/active');
    return data;
  }

  async driverAcceptOrder(id: string): Promise<ApiResponse<Order>> {
    const { data } = await this.client.post(`/orders/driver/${id}/accept`);
    return data;
  }

  async driverDeclineOrder(id: string): Promise<ApiResponse<void>> {
    const { data } = await this.client.post(`/orders/driver/${id}/decline`);
    return data;
  }

  async updateDeliveryStatus(id: string, payload: UpdateDeliveryStatusDto): Promise<ApiResponse<Order>> {
    const { data } = await this.client.patch(`/orders/driver/${id}/status`, payload);
    return data;
  }
}

import { PaymentMethod, OrderStatus, SelectedModifierGroup } from '@dawwar/types';

export interface OrderItemDto {
  productId: string;
  productName: string;
  productNameAr?: string;
  quantity: number;
  price: number;
  selectedModifiers?: SelectedModifierGroup[];
}

export interface PlaceOrderDto {
  merchantId: string;
  items: OrderItemDto[];
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryPhone: string;
  deliveryNotes?: string;
  deliveryFee: number;
  promoCode?: string;
  deliverAt?: string; // ISO date string
}

export interface PlaceCustomOrderDto {
  shopName?: string;
  shopAddress: string;
  shopLatitude: number;
  shopLongitude: number;
  itemsDescription?: string;
  itemsVoiceNote?: string;
  itemsImages?: string[];
  estimatedBudget: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryPhone: string;
  deliveryFee?: number;
  deliverAt?: string; // ISO date string
}

export interface AcceptOrderDto {
  prepMinutes: number;
}

export interface RejectOrderDto {
  reason: string;
}

export interface UpdateDeliveryStatusDto {
  status: OrderStatus;
  actualAmount?: number;
  receiptImage?: string;
}

import { z } from 'zod';
import { PaymentMethod, OrderStatus } from '@dawwar/types';

export const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productNameAr: z.string().optional(),
  quantity: z.number().min(1),
  price: z.number().positive(),
});

export const PlaceOrderSchema = z.object({
  merchantId: z.string(),
  items: z.array(OrderItemSchema).min(1),
  paymentMethod: z.nativeEnum(PaymentMethod),
  deliveryAddress: z.string().min(5),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
  deliveryPhone: z.string().min(10),
  deliveryNotes: z.string().optional(),
  deliveryFee: z.number().min(0),
  promoCode: z.string().optional(),
  deliverAt: z.string().datetime().optional(),
});

export const PlaceCustomOrderSchema = z.object({
  shopName: z.string().optional(),
  shopAddress: z.string().min(5),
  shopLatitude: z.number(),
  shopLongitude: z.number(),
  itemsDescription: z.string().optional(),
  itemsVoiceNote: z.string().optional(),
  itemsImages: z.array(z.string()).optional(),
  estimatedBudget: z.number().positive(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  deliveryAddress: z.string().min(5),
  deliveryLatitude: z.number(),
  deliveryLongitude: z.number(),
  deliveryPhone: z.string().min(10),
  deliveryFee: z.number().min(0),
  deliverAt: z.string().datetime().optional(),
});

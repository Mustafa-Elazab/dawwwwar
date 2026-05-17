export enum Role {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  READY = 'READY',             // regular order: prepared by merchant, waiting for pickup
  DRIVER_ASSIGNED = 'DRIVER_ASSIGNED',
  AT_SHOP = 'AT_SHOP',         // custom order: driver arrived at shop
  SHOPPING = 'SHOPPING',       // custom order: driver is buying items
  PURCHASED = 'PURCHASED',     // custom order: items bought, ready to deliver
  PICKED_UP = 'PICKED_UP',     // regular order: driver collected from merchant
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum OrderType {
  REGULAR = 'REGULAR',
  CUSTOM = 'CUSTOM',
}

export enum PaymentMethod {
  CASH = 'CASH',
  WALLET = 'WALLET',
}

export enum VehicleType {
  MOTORCYCLE = 'MOTORCYCLE',
  BICYCLE = 'BICYCLE',
  CAR = 'CAR',
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionReason {
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  DELIVERY_FEE = 'DELIVERY_FEE',
  COMMISSION_DEDUCTION = 'COMMISSION_DEDUCTION',
  WALLET_RECHARGE = 'WALLET_RECHARGE',
  REFUND = 'REFUND',
  WITHDRAWAL = 'WITHDRAWAL',
  ADJUSTMENT = 'ADJUSTMENT',
  TIP = 'TIP',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
}

export enum PayoutMethod {
  PAYMOB_BANK = 'PAYMOB_BANK',
  PAYMOB_WALLET = 'PAYMOB_WALLET',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum Language {
  EN = 'en',
  AR = 'ar',
}

// Active statuses — orders that are not yet finished
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.ACCEPTED,
  OrderStatus.READY,
  OrderStatus.DRIVER_ASSIGNED,
  OrderStatus.AT_SHOP,
  OrderStatus.SHOPPING,
  OrderStatus.PURCHASED,
  OrderStatus.PICKED_UP,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED,
];

// Terminal statuses — orders that are finished
export const TERMINAL_ORDER_STATUSES: OrderStatus[] = [
  OrderStatus.COMPLETED,
  OrderStatus.CANCELLED,
  OrderStatus.REJECTED,
];

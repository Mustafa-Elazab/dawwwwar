import type {
  Role,
  VehicleType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  TransactionType,
  TransactionReason,
} from './enums';

// ─── USER ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  name: string;
  role: Role;
  profileImage?: string;
  isApproved: boolean;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── MERCHANT ────────────────────────────────────────────────────────────────

export interface DayHours {
  open: string;   // "08:00"
  close: string;  // "22:00"
}

export interface OpeningHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  category: string;             // category ID
  address: string;
  latitude: number;
  longitude: number;
  isOpen: boolean;
  isApproved: boolean;
  canReceiveOrders: boolean;
  rating: number;               // 0.0 – 5.0
  totalRatings: number;
  deliveryTimeMin: number;      // minutes
  deliveryTimeMax: number;      // minutes
  logo?: string;                // URL
  coverImage?: string;          // URL
  commissionRate: number;       // EGP per order
  openingHours: OpeningHours;
  createdAt: string;
  updatedAt: string;
}

// ─── PRODUCT ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;      // original price before discount
  images: string[];             // array of URLs
  isAvailable: boolean;
  categoryId: string;
  isFeatured: boolean;
  totalOrders: number;
  createdAt: string;
  updatedAt: string;
}

// ─── CATEGORY ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;                 // emoji or icon name
  sortOrder: number;
  isActive: boolean;
}

// ─── DRIVER ──────────────────────────────────────────────────────────────────

export interface DriverProfile {
  id: string;
  userId: string;
  user: Pick<User, 'id' | 'name' | 'phone' | 'profileImage'>;
  vehicleType: VehicleType;
  isOnline: boolean;
  isApproved: boolean;
  canReceiveOrders: boolean;
  vehiclePlate?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  lastLocationUpdate?: string;
  rating: number;
  totalRatings: number;
  totalDeliveries: number;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

// ─── ORDER ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productNameAr?: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;          // human readable: "ORD-12345"
  customerId: string;
  merchantId?: string;
  driverId?: string;
  type: OrderType;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  discount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  tip?: number;
  // Custom order only
  shopName?: string;
  shopAddress?: string;
  shopLatitude?: number;
  shopLongitude?: number;
  itemsDescription?: string;
  itemsVoiceNote?: string;
  itemsImages?: string[];
  estimatedBudget?: number;
  actualAmount?: number;
  receiptImage?: string;
  // Delivery
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  deliveryPhone: string;
  deliveryNotes?: string;
  // Commissions
  merchantCommission: number;
  driverCommission: number;
  commissionsDeducted: boolean;
  // Relations (populated on detail views)
  merchant?: Merchant;
  driver?: DriverProfile;
  items?: OrderItem[];
  // Timestamps
  acceptedAt?: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── WALLET ──────────────────────────────────────────────────────────────────

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;             // always "EGP"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  reason: TransactionReason;
  orderId?: string;
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ─── ADDRESS ─────────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  label: string;                // "Home", "Work", "البيت", etc.
  address: string;
  latitude: number;
  longitude: number;
  buildingNumber?: string;
  floor?: string;
  apartment?: string;
  phone: string;
  notes?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  titleAr?: string;
  body: string;
  bodyAr?: string;
  type: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

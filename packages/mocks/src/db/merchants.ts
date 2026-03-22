import type { Merchant } from '@dawwar/types';

// Placeholder image helper
const ph = (text: string, bg = 'FF6B35', fg = 'white') =>
  `https://placehold.co/400x400/${bg}/${fg}?text=${encodeURIComponent(text)}`;

const phCover = (text: string) =>
  `https://placehold.co/800x400/2D3436/white?text=${encodeURIComponent(text)}`;

export const mockMerchants: Merchant[] = [
  {
    id: 'merchant-001',
    userId: 'user-merchant-01',
    businessName: 'محل النور للبقالة',
    category: 'cat-01',
    address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
    latitude: 30.8704,
    longitude: 31.4741,
    isOpen: true,
    isApproved: true,
    canReceiveOrders: true,
    rating: 4.5,
    totalRatings: 234,
    deliveryTimeMin: 15,
    deliveryTimeMax: 25,
    logo: ph('نور'),
    coverImage: phCover('Al Nour Grocery'),
    commissionRate: 5,
    openingHours: {
      monday:    { open: '08:00', close: '22:00' },
      tuesday:   { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday:  { open: '08:00', close: '22:00' },
      friday:    { open: '10:00', close: '22:00' },
      saturday:  { open: '08:00', close: '22:00' },
      sunday:    { open: '08:00', close: '22:00' },
    },
    createdAt: '2024-01-03T08:00:00Z',
    updatedAt: '2024-01-03T08:00:00Z',
  },
  {
    id: 'merchant-002',
    userId: 'user-merchant-02',
    businessName: 'مطعم الشيف',
    category: 'cat-02',
    address: 'ميدان المحطة، سنبلاوين',
    latitude: 30.8720,
    longitude: 31.4755,
    isOpen: true,
    isApproved: true,
    canReceiveOrders: true,
    rating: 4.8,
    totalRatings: 512,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    logo: ph('شيف', 'E17055'),
    coverImage: phCover('El Chef Restaurant'),
    commissionRate: 5,
    openingHours: {
      monday:    { open: '10:00', close: '23:00' },
      tuesday:   { open: '10:00', close: '23:00' },
      wednesday: { open: '10:00', close: '23:00' },
      thursday:  { open: '10:00', close: '23:00' },
      friday:    { open: '12:00', close: '23:00' },
      saturday:  { open: '10:00', close: '23:00' },
      sunday:    { open: '10:00', close: '23:00' },
    },
    createdAt: '2024-01-04T08:00:00Z',
    updatedAt: '2024-01-04T08:00:00Z',
  },
  {
    id: 'merchant-003',
    userId: 'user-merchant-03',
    businessName: 'صيدلية الحياة',
    category: 'cat-03',
    address: 'شارع النصر، سنبلاوين',
    latitude: 30.8690,
    longitude: 31.4728,
    isOpen: false,  // INTENTIONALLY CLOSED — tests the "Closed" UI badge
    isApproved: true,
    canReceiveOrders: false,
    rating: 4.2,
    totalRatings: 89,
    deliveryTimeMin: 10,
    deliveryTimeMax: 20,
    logo: ph('صيدلية', '00B894'),
    coverImage: phCover('Al Hayat Pharmacy'),
    commissionRate: 5,
    openingHours: {
      monday:    { open: '09:00', close: '21:00' },
      tuesday:   { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday:  { open: '09:00', close: '21:00' },
      friday:    null,  // closed on Friday
      saturday:  { open: '09:00', close: '21:00' },
      sunday:    { open: '09:00', close: '21:00' },
    },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
];

export const getMerchantById = (id: string): Merchant | undefined =>
  mockMerchants.find((m) => m.id === id);

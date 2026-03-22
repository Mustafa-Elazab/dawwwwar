import { Role } from '@dawwar/types';
import type { User } from '@dawwar/types';

// Helper: normalize Egyptian phone to 01XXXXXXXXX format
export const normalizePhone = (phone: string): string =>
  phone
    .replace(/^\+20/, '0')
    .replace(/^20(?=1)/, '0')
    .replace(/\s/g, '');

export const mockUsers: User[] = [
  {
    id: 'user-customer-01',
    phone: '01011111111',
    name: 'أحمد محمد',
    role: Role.CUSTOMER,
    isApproved: true,
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'user-customer-02',
    phone: '01022222222',
    name: 'Sara Ahmed',
    role: Role.CUSTOMER,
    isApproved: true,
    createdAt: '2024-01-02T08:00:00Z',
    updatedAt: '2024-01-02T08:00:00Z',
  },
  {
    id: 'user-merchant-01',
    phone: '01033333333',
    name: 'محل النور',
    role: Role.MERCHANT,
    isApproved: true,
    createdAt: '2024-01-03T08:00:00Z',
    updatedAt: '2024-01-03T08:00:00Z',
  },
  {
    id: 'user-merchant-02',
    phone: '01044444444',
    name: 'مطعم الشيف',
    role: Role.MERCHANT,
    isApproved: true,
    createdAt: '2024-01-04T08:00:00Z',
    updatedAt: '2024-01-04T08:00:00Z',
  },
  {
    id: 'user-merchant-03',
    phone: '01055555555',
    name: 'صيدلية الحياة',
    role: Role.MERCHANT,
    isApproved: true,
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 'user-driver-01',
    phone: '01066666666',
    name: 'محمود علي',
    role: Role.DRIVER,
    isApproved: true,
    createdAt: '2024-01-06T08:00:00Z',
    updatedAt: '2024-01-06T08:00:00Z',
  },
  {
    id: 'user-driver-02',
    phone: '01077777777',
    name: 'Karim Hassan',
    role: Role.DRIVER,
    isApproved: true,
    createdAt: '2024-01-07T08:00:00Z',
    updatedAt: '2024-01-07T08:00:00Z',
  },
  {
    id: 'user-merchant-pending',
    phone: '01088888888',
    name: 'محل جديد',
    role: Role.MERCHANT,
    isApproved: false,  // pending approval
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-08T08:00:00Z',
  },
  {
    id: 'user-driver-pending',
    phone: '01099999999',
    name: 'سائق جديد',
    role: Role.DRIVER,
    isApproved: false,  // pending approval
    createdAt: '2024-01-09T08:00:00Z',
    updatedAt: '2024-01-09T08:00:00Z',
  },
  {
    id: 'user-admin',
    phone: '01000000000',
    name: 'Admin دوّار',
    role: Role.ADMIN,
    isApproved: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
];

export const findUserByPhone = (phone: string): User | undefined => {
  const normalized = normalizePhone(phone);
  return mockUsers.find((u) => normalizePhone(u.phone) === normalized);
};

export const getUserById = (id: string): User | undefined =>
  mockUsers.find((u) => u.id === id);

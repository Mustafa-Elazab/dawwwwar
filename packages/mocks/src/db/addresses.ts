import type { Address } from '@dawwar/types';

export const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    userId: 'user-customer-01',
    label: 'Home',
    address: 'شارع الجمهورية، سنبلاوين، الدقهلية',
    latitude: 30.872,
    longitude: 31.476,
    buildingNumber: '14',
    floor: '2',
    apartment: '8',
    phone: '01011111111',
    notes: 'Ring bell twice',
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'addr-002',
    userId: 'user-customer-01',
    label: 'Work',
    address: 'ميدان المحطة، سنبلاوين',
    latitude: 30.871,
    longitude: 31.475,
    phone: '01011111111',
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

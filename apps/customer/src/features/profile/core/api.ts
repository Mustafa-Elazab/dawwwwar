import { addressesMock } from '@dawwar/mocks';
import type { Address } from '@dawwar/types';

export const profileApi = {
  getAddresses: (userId: string) => addressesMock.getByUser(userId),
  saveAddress: (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>) =>
    addressesMock.save(address),
  deleteAddress: (id: string) => addressesMock.delete(id),
};

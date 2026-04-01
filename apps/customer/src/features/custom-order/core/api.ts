import { ordersMock } from '@dawwar/mocks';

export const customOrderApi = {
  place: (payload: Parameters<typeof ordersMock.placeCustomOrder>[0]) =>
    ordersMock.placeCustomOrder(payload),
};

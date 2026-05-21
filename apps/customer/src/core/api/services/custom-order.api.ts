import { api } from '../client';

export const customOrderApi = {
  place: async (payload: object) => {
    const { data } = await api.post('/orders/custom', payload);
    return data;
  },
};

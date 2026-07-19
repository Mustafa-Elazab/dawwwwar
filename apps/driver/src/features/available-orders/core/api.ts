import api from '../../../core/api/client';
// ── Phase 2 real implementations ─────────────────────────────────────
const realAvailableOrdersApi = {
  getAvailable: async () => {
    const { data } = await api.get('/orders/driver/available');
    return data;
  },
  acceptOrder: async (orderId: string) => {
    const { data } = await api.post(`/orders/driver/${orderId}/accept`);
    return data;
  },
  declineOrder: async (orderId: string) => {
    const { data } = await api.post(`/orders/driver/${orderId}/decline`);
    return data;
  },
  updateLocation: async (latitude: number, longitude: number) => {
    const { data } = await api.patch('/driver/location', { latitude, longitude });
    return data;
  },
};


export const availableOrdersApi = realAvailableOrdersApi;

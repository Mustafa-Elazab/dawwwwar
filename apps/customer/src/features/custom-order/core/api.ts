import api from '../../../core/api/client';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCustomOrderApi = {
  place: async (payload: object) => {
    const { data } = await api.post('/orders/custom', payload);
    return data;
  },
};


export const customOrderApi = realCustomOrderApi;

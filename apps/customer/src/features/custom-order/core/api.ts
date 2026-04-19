import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { ordersMock } from '@dawwar/mocks';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCustomOrderApi = {
  place: async (payload: object) => {
    const { data } = await api.post('/orders/custom', payload);
    return data;
  },
};

const mockCustomOrderApi = {
  place: (payload: Parameters<typeof ordersMock.placeCustomOrder>[0]) =>
    ordersMock.placeCustomOrder(payload),
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const customOrderApi = USE_MOCK_API ? mockCustomOrderApi : realCustomOrderApi;

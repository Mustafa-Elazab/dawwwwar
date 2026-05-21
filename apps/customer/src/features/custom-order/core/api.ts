import { customOrderApi as customOrderService } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realCustomOrderApi = {
  place: async (payload: object) => customOrderService.place(payload),
};

export const customOrderApi = realCustomOrderApi;

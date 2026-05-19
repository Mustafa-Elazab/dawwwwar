import api from '../../../core/api/client';
import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from './response';

// ── Phase 2 real implementations ─────────────────────────────────────
const realAuthApi = {
  sendOtp: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  },
  verifyOtp: async (phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    const { data } = await api.post('/auth/merchant/verify-otp', { phone, code });
    return data;
  },
  getMe: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

export const authApi = realAuthApi;

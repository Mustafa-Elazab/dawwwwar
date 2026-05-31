import api from '../../../core/api/client';
import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from './response';

// ── Phase 2 real implementations ─────────────────────────────────────
const realAuthApi = {
  getMe: async (): Promise<ApiResponse<any>> => {
    const { data } = await api.get('/users/me');
    return data;
  },
  sendOtp: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => {
    const { data } = await api.post('/auth/customer/send-otp', { phone });
    return data;
  },
  verifyOtp: async (
    phone: string,
    code: string,
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    const { data } = await api.post('/auth/customer/verify-otp', { phone, code });
    return data;
  },
};


export const authApi = realAuthApi;

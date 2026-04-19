import { USE_MOCK_API } from '../../../../core/api/config';
import api from '../../../../core/api/client';
import { authMock } from '@dawwar/mocks';
import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from './response';

// ── Phase 2 real implementations ─────────────────────────────────────
const realAuthApi = {
  sendOtp: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  },
  verifyOtp: async (
    phone: string,
    code: string,
  ): Promise<ApiResponse<VerifyOtpResponse>> => {
    const { data } = await api.post('/auth/verify-otp', { phone, code });
    return data;
  },
};

const mockAuthApi = {
  sendOtp: (phone: string) => authMock.sendOtp({ phone }),
  verifyOtp: (phone: string, code: string) => authMock.verifyOtp(phone, code),
};

// ── Export: mock when USE_MOCK_API=true, real when false ──────────────
export const authApi = USE_MOCK_API ? mockAuthApi : realAuthApi;

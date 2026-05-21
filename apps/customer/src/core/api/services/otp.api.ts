import { publicApi } from '../client';
import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from '../../../features/auth/core/response';

export const otpApi = {
  sendOtp: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => {
    const { data } = await publicApi.post('/auth/send-otp', { phone });
    return data;
  },
  verifyOtp: async (phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> => {
    const { data } = await publicApi.post('/auth/verify-otp', { phone, code });
    return data;
  },
};

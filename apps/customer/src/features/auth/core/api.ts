import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from './response';
import { authApi as authService, otpApi as otpService } from '../../../core/api/services';

// ── Phase 2 real implementations ─────────────────────────────────────
const realAuthApi = {
  getMe: async (): Promise<ApiResponse<any>> => authService.getMe(),
  sendOtp: async (phone: string): Promise<ApiResponse<SendOtpResponse>> => otpService.sendOtp(phone),
  verifyOtp: async (phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> =>
    otpService.verifyOtp(phone, code),
};


export const authApi = realAuthApi;

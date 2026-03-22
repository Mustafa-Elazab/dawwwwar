// Phase 1: delegates to @dawwar/mocks
// Phase 2: replace bodies with real axios calls — caller (hooks.ts) never changes

import { authMock } from '@dawwar/mocks';
import type { ApiResponse } from '@dawwar/types';
import type { SendOtpResponse, VerifyOtpResponse } from './response';

export const authApi = {
  sendOtp: (phone: string): Promise<ApiResponse<SendOtpResponse>> =>
    authMock.sendOtp({ phone }),

  verifyOtp: (
    phone: string,
    code: string,
  ): Promise<ApiResponse<VerifyOtpResponse>> =>
    authMock.verifyOtp({ phone, code }),
};

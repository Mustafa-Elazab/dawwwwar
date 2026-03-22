import { delay } from '../utils/delay';
import { findUserByPhone } from '../db/users';
import { getWalletByUser } from '../db/wallets';
import type { ApiResponse, AuthResponse, Wallet } from '@dawwar/types';

const SANDBOX_OTP = '123456';

interface SendOtpPayload { phone: string; }
interface SendOtpResult { expiresIn: number; }
interface VerifyOtpPayload { phone: string; code: string; }

export const authMock = {
  sendOtp: async (payload: SendOtpPayload): Promise<ApiResponse<SendOtpResult>> => {
    await delay(800);
    // Validate Egyptian phone format
    const normalized = payload.phone.replace(/^\+20/, '0').replace(/\s/g, '');
    if (!/^01[0125]\d{8}$/.test(normalized)) {
      throw Object.assign(new Error('INVALID_PHONE'), { code: 'INVALID_PHONE' });
    }
    return { success: true, data: { expiresIn: 120 } };
  },

  verifyOtp: async (payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponse>> => {
    await delay(1000);
    if (payload.code !== SANDBOX_OTP) {
      throw Object.assign(new Error('INVALID_OTP'), { code: 'INVALID_OTP', remaining: 4 });
    }
    const user = findUserByPhone(payload.phone);
    if (!user) {
      throw Object.assign(new Error('USER_NOT_FOUND'), { code: 'USER_NOT_FOUND' });
    }
    return {
      success: true,
      data: {
        accessToken: `mock-access-${user.id}-${Date.now()}`,
        refreshToken: `mock-refresh-${user.id}-${Date.now()}`,
        user,
        isFirstLogin: false,
      },
    };
  },

  getWallet: async (userId: string): Promise<ApiResponse<Wallet>> => {
    await delay(300);
    const wallet = getWalletByUser(userId);
    if (!wallet) throw new Error('WALLET_NOT_FOUND');
    return { success: true, data: wallet };
  },
};

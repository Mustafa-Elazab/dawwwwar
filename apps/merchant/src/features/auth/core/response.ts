import type { User } from '@dawwar/types';

export interface SendOtpResponse {
  expiresIn: number;   // seconds
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  isFirstLogin: boolean;
}

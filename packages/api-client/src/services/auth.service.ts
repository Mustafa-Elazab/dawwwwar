import { AxiosInstance } from 'axios';
import { ApiResponse } from '@dawwar/types';
import { SendOtpResponse, VerifyOtpResponse } from '../types/auth.types';

export class AuthService {
  constructor(private client: AxiosInstance) {}

  async getMe(): Promise<ApiResponse<any>> {
    const { data } = await this.client.get('/users/me');
    return data;
  }

  async sendOtp(phone: string): Promise<ApiResponse<SendOtpResponse>> {
    const { data } = await this.client.post('/auth/send-otp', { phone });
    return data;
  }

  async verifyOtp(phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/verify-otp', { phone, code });
    return data;
  }

  async refresh(refreshToken: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/refresh', { refreshToken });
    return data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const { data } = await this.client.post('/auth/logout');
    return data;
  }

  async selectRole(role: string): Promise<ApiResponse<any>> {
    const { data } = await this.client.post('/auth/select-role', { role });
    return data;
  }
}

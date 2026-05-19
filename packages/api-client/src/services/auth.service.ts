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

  async verifyCustomerOtp(phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/customer/verify-otp', { phone, code });
    return data;
  }

  async verifyMerchantOtp(phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/merchant/verify-otp', { phone, code });
    return data;
  }

  async verifyDriverOtp(phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/driver/verify-otp', { phone, code });
    return data;
  }

  async verifyAdminOtp(phone: string, code: string): Promise<ApiResponse<VerifyOtpResponse>> {
    const { data } = await this.client.post('/auth/admin/verify-otp', { phone, code });
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
}

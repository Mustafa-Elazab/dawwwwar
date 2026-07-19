import { AxiosInstance } from 'axios';
import { ApiResponse, DriverProfile, WalletTransaction } from '@dawwar/types';

export interface DailyEarning {
  day: string;
  dayAr: string;
  net: number;
  deliveries: number;
}

export interface EarningsSummary {
  todayDeliveries: number;
  todayGross: number;
  todayCommission: number;
  todayNet: number;
  weeklyData: DailyEarning[];
}

export class DriverService {
  constructor(private client: AxiosInstance) {}

  async getProfile(): Promise<ApiResponse<DriverProfile>> {
    const { data } = await this.client.get('/driver/profile');
    return data;
  }

  async toggleOnline(isOnline: boolean): Promise<ApiResponse<DriverProfile>> {
    const { data } = await this.client.post('/driver/online', { isOnline });
    return data;
  }

  async updateAvailability(isOnline: boolean): Promise<ApiResponse<DriverProfile>> {
    const { data } = await this.client.post('/driver/availability', { isOnline });
    return data;
  }

  async updateLocation(payload: { latitude: number; longitude: number; heading?: number }): Promise<void> {
    await this.client.patch('/driver/location', payload);
  }

  async getEarnings(): Promise<ApiResponse<EarningsSummary>> {
    const { data } = await this.client.get('/driver/earnings');
    return data;
  }

  async getWalletBalance(): Promise<ApiResponse<number>> {
    const { data } = await this.client.get('/driver/wallet');
    return data;
  }

  async getTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    const { data } = await this.client.get('/driver/transactions');
    return data;
  }
}

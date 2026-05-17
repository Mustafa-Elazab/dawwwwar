import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PayoutRequestEntity } from '../../../database/entities/payout-request.entity';

@Injectable()
export class PaymobPayoutService {
  private readonly logger = new Logger(PaymobPayoutService.name);
  private readonly client: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.client = axios.create({
      baseURL: 'https://egypt.paymob.com/api',
    });
  }

  /**
   * Retrieves an authentication token from Paymob.
   */
  async authenticate(): Promise<string> {
    const apiKey = this.config.get<string>('paymob.apiKey');
    try {
      const { data } = await this.client.post('/auth/tokens', { api_key: apiKey });
      return data.token;
    } catch (err) {
      this.logger.error(`Authentication failed: ${err.response?.data?.message || err.message}`);
      throw new Error('PAYMOB_AUTH_FAILED');
    }
  }

  /**
   * Initiates a payout (disbursement) via Paymob.
   */
  async sendPayout(request: PayoutRequestEntity): Promise<{ success: boolean; txId?: string; rawResponse?: any }> {
    const apiKey = this.config.get<string>('paymob.apiKey');
    if (!apiKey && process.env.NODE_ENV !== 'production') {
      this.logger.warn('Paymob not configured, falling back to DEV payout simulation');
      // Simulate success for DEV
      return { success: true, txId: `dev-tx-${Date.now()}`, rawResponse: { status: 'success', simulated: true } };
    }

    try {
      const token = await this.authenticate();
      
      const payload = {
        amount: Math.round(Number(request.amount) * 100), // convert to cents
        currency: 'EGP',
        payment_method: request.method === 'PAYMOB_WALLET' ? 'wallet' : 'bank_transfer',
        // In production, these would be pulled from driver's verified KYC data
        disbursement_data: {
          full_name: request.user?.name || 'Dawwar Driver',
          phone_number: request.user?.phone,
          ...request.paymentDetails,
        },
      };

      const { data } = await this.client.post('/disbursements', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      this.logger.log(`Payout initiated for request ${request.id}: Status ${data.status}`);

      return {
        success: data.status === 'success' || data.status === 'pending',
        txId: data.id?.toString(),
        rawResponse: data,
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      this.logger.error(`Disbursement failed for request ${request.id}: ${msg}`);
      return { success: false, rawResponse: err.response?.data };
    }
  }
}

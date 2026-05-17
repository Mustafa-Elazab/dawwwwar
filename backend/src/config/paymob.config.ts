import { registerAs } from '@nestjs/config';

export const paymobConfig = registerAs('paymob', () => ({
  apiKey: process.env.PAYMOB_API_KEY,
  payoutIntegrationId: process.env.PAYMOB_PAYOUT_INTEGRATION_ID,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET,
}));

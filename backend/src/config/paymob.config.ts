import { registerAs } from '@nestjs/config';

export const paymobConfig = registerAs('paymob', () => ({
  apiKey: process.env.PAYMOB_API_KEY,
  integrationIdCard: process.env.PAYMOB_INTEGRATION_ID_CARD ?? process.env.PAYMOB_INTEGRATION_ID,
  integrationIdWallet: process.env.PAYMOB_INTEGRATION_ID_WALLET,
  iframeId: process.env.PAYMOB_IFRAME_ID,
  payoutIntegrationId: process.env.PAYMOB_PAYOUT_INTEGRATION_ID,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET,
}));

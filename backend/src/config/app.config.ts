import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  otpSandbox: process.env.OTP_SANDBOX === 'true',
  otpSandboxCode: process.env.OTP_SANDBOX_CODE ?? '123456',
  otpExpiresSeconds: parseInt(process.env.OTP_EXPIRES_SECONDS ?? '120', 10),
  // Verifyway SMS (P3-01)
  verifywayApiKey: process.env.VERIFYWAY_API_KEY ?? '',
  verifywayBaseUrl: process.env.VERIFYWAY_BASE_URL ?? 'https://app.verifyway.io/api/v1',
  // Paymob (P3-02)
  paymobApiKey: process.env.PAYMOB_API_KEY ?? '',
  paymobIntegrationId: process.env.PAYMOB_INTEGRATION_ID ?? '',
  paymobHmacSecret: process.env.PAYMOB_HMAC_SECRET ?? '',
}));

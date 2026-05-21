import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? '0.0.0.0',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  corsOrigins: (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  bodyLimit: process.env.BODY_LIMIT ?? '2mb',
  requestTimeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS ?? '30000', 10),
  trustProxy: process.env.TRUST_PROXY === 'true',
  otpSandbox: process.env.OTP_SANDBOX === 'true',
  otpSandboxCode: process.env.OTP_SANDBOX_CODE ?? '1111',
  otpExpiresSeconds: parseInt(process.env.OTP_EXPIRES_SECONDS ?? '120', 10),
  // Verifyway SMS (P3-01)
  verifywayApiKey: process.env.VERIFYWAY_API_KEY ?? '',
  verifywayBaseUrl: process.env.VERIFYWAY_BASE_URL ?? 'https://app.verifyway.io/api/v1',
  // Paymob (P3-02)
  paymobApiKey: process.env.PAYMOB_API_KEY ?? '',
  paymobIntegrationId: process.env.PAYMOB_INTEGRATION_ID ?? '',
  paymobHmacSecret: process.env.PAYMOB_HMAC_SECRET ?? '',
}));

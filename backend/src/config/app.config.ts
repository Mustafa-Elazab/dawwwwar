import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  otpSandbox: process.env.OTP_SANDBOX === 'true',
  otpSandboxCode: process.env.OTP_SANDBOX_CODE ?? '123456',
  otpExpiresSeconds: parseInt(process.env.OTP_EXPIRES_SECONDS ?? '120', 10),
}));

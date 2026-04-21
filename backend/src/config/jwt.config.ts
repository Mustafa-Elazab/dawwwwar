import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change_me',
  accessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change_me_refresh',
  refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '30d',
}));

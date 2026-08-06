import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? 'dev_access_secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? process.env.JWT_EXPIRES_IN ?? '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),
}));

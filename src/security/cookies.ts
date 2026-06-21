import { CookieOptions } from 'express';
import { env } from '../config/env';

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.COOKIE_SECURE,
  sameSite: 'strict',
  path: '/api/admin/auth/refresh',
  maxAge: 1000 * 60 * 60 * 24 * 30,
  domain: env.COOKIE_DOMAIN || undefined,
};

export const clearRefreshCookieOptions: CookieOptions = {
  ...refreshCookieOptions,
  maxAge: 0,
};

import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { env } from '../config/env';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

const ACCESS_SECRET: Secret = env.JWT_ACCESS_SECRET;
const REFRESH_SECRET: Secret = env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES: SignOptions['expiresIn'] =
  env.ACCESS_TOKEN_EXPIRES as SignOptions['expiresIn'];

const REFRESH_EXPIRES: SignOptions['expiresIn'] =
  env.REFRESH_TOKEN_EXPIRES as SignOptions['expiresIn'];

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    algorithm: 'HS512',
    expiresIn: ACCESS_EXPIRES,
  });
}

export function signRefreshToken(adminId: string): string {
  return jwt.sign(
    { sub: adminId },
    REFRESH_SECRET,
    {
      algorithm: 'HS512',
      expiresIn: REFRESH_EXPIRES,
    }
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET, {
    algorithms: ['HS512'],
  }) as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string,
): { sub: string } {
  return jwt.verify(token, REFRESH_SECRET, {
    algorithms: ['HS512'],
  }) as { sub: string };
}

import { AdminUser } from '@prisma/client';

import {
  signAccessToken,
  signRefreshToken,
} from '../../security/jwt';

import { sha256 } from '../../security/crypto';

import { refreshTokenRepository } from '../../repositories/refresh-token.repository';

const REFRESH_TOKEN_TTL =
  30 * 24 * 60 * 60 * 1000;

export class TokenService {
  async generate(admin: AdminUser) {
    const accessToken = signAccessToken({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const refreshToken =
      signRefreshToken(admin.id);

    const refreshTokenHash =
      sha256(refreshToken);

    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_TTL,
    );

    await refreshTokenRepository.create(
      admin.id,
      refreshTokenHash,
      expiresAt,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async revoke(refreshToken: string) {
    const tokenHash = sha256(refreshToken);

    const token =
      await refreshTokenRepository.find(tokenHash);

    if (!token) {
      return;
    }

    await refreshTokenRepository.revoke(token.id);
  }

  async revokeAll(adminId: string) {
    await refreshTokenRepository.revokeAll(adminId);
  }
}

export const tokenService =
  new TokenService();

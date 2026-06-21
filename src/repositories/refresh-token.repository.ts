import { prisma } from '../lib/prisma';

export class RefreshTokenRepository {
  async create(
    adminId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return prisma.refreshToken.create({
      data: {
        adminId,
        tokenHash,
        expiresAt,
      },
    });
  }

  async find(tokenHash: string) {
    return prisma.refreshToken.findUnique({
      where: {
        tokenHash,
      },
    });
  }

  async revoke(id: string) {
    return prisma.refreshToken.update({
      where: { id },
      data: {
        revoked: true,
      },
    });
  }

  async revokeAll(adminId: string) {
    return prisma.refreshToken.updateMany({
      where: {
        adminId,
        revoked: false,
      },
      data: {
        revoked: true,
      },
    });
  }
}

export const refreshTokenRepository =
  new RefreshTokenRepository();

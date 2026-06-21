import { AdminRole } from '@prisma/client';

import { adminRepository } from '../../repositories/admin.repository';
import { auditRepository } from '../../repositories/audit.repository';

import {
  hashPassword,
  verifyPassword,
  needsRehash,
} from '../../security/password';

import {
  signAccessToken,
} from '../../security/jwt';

import { env } from '../../config/env';

export class AuthService {

  async bootstrapSuperAdmin() {

    const existing = await adminRepository.findByEmail(
      env.ADMIN_EMAIL,
    );

    if (existing) {
      return existing;
    }

    const passwordHash = await hashPassword(
      env.ADMIN_PASSWORD,
    );

    return adminRepository.create({
      email: env.ADMIN_EMAIL,
      fullName: env.ADMIN_NAME,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    });
  }

  async login(
    email: string,
    password: string,
    ip?: string,
    userAgent?: string,
  ) {

    const admin =
      await adminRepository.findByEmail(email);

    if (!admin) {
      return null;
    }

    const valid =
      await verifyPassword(
        password,
        admin.passwordHash,
      );

    if (!valid) {
      return null;
    }

    if (
      await needsRehash(admin.passwordHash)
    ) {

      const newHash =
        await hashPassword(password);

      // update later
      admin.passwordHash = newHash;
    }

    await adminRepository.updateLastLogin(
      admin.id,
    );

    await auditRepository.log({
      adminId: admin.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: ip,
      userAgent,
    });

    const accessToken =
      signAccessToken({
        sub: admin.id,
        email: admin.email,
        role: admin.role,
      });

    return {
      admin,
      accessToken,
    };
  }

}
export const authService =
  new AuthService();

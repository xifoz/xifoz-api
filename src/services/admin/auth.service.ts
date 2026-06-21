import { AdminRole } from '@prisma/client';

import { env } from '../../config/env';

import { adminRepository } from '../../repositories/admin.repository';
import { auditRepository } from '../../repositories/audit.repository';

import {
  hashPassword,
  verifyPassword,
  needsRehash,
} from '../../security/password';

import { sessionService } from './session.service';

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

  async login(data: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const admin = await adminRepository.findByEmail(
      data.email,
    );

    if (!admin) {
      return null;
    }

    const valid = await verifyPassword(
      data.password,
      admin.passwordHash,
    );

    if (!valid) {
      return null;
    }

    if (await needsRehash(admin.passwordHash)) {
      const newHash = await hashPassword(
        data.password,
      );

      await adminRepository.updatePasswordHash(
        admin.id,
        newHash,
      );
    }

    await adminRepository.updateLastLogin(
      admin.id,
    );

    await auditRepository.log({
      adminId: admin.id,
      action: 'LOGIN_SUCCESS',
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    });

    const session =
      await sessionService.create(admin);

    return {
      admin,
      ...session,
    };
  }
}

export const authService =
  new AuthService();

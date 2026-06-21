import { AdminRole } from '@prisma/client';

import { env } from '../../config/env';
import { adminRepository } from '../../repositories/admin.repository';
import { hashPassword } from '../../security/password';

export class BootstrapService {
  async run(): Promise<void> {
    const existing = await adminRepository.findByEmail(
      env.ADMIN_EMAIL,
    );

    if (existing) {
      console.log('✓ Super Admin already exists');
      return;
    }

    const passwordHash = await hashPassword(
      env.ADMIN_PASSWORD,
    );

    await adminRepository.create({
      email: env.ADMIN_EMAIL,
      fullName: env.ADMIN_NAME,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    });

    console.log('✓ Initial Super Admin created');
  }
}

export const bootstrapService =
  new BootstrapService();

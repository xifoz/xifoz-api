import { AdminUser } from '@prisma/client';

import { tokenService } from './token.service';

export class SessionService {
  async create(admin: AdminUser) {
    return tokenService.generate(admin);
  }

  async revoke(refreshToken: string) {
    await tokenService.revoke(refreshToken);
  }

  async revokeAll(adminId: string) {
    await tokenService.revokeAll(adminId);
  }
}

export const sessionService =
  new SessionService();

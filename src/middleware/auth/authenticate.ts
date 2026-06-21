import { Request, Response, NextFunction } from 'express';
import { AdminUser } from '@prisma/client';

import { verifyAccessToken } from '../../security/jwt';
import { adminRepository } from '../../repositories/admin.repository';
import { UnauthorizedError } from '../../core/errors/app-error';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.header('authorization');

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing access token');
    }

    const token = header.substring(7);

    const payload = verifyAccessToken(token);

    const admin = await adminRepository.findById(payload.sub);

    if (!admin) {
      throw new UnauthorizedError('Administrator not found');
    }

    if (!admin.isActive) {
      throw new UnauthorizedError('Account is disabled');
    }

    req.admin = admin;

    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

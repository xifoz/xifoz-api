import { AdminRole } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

import { ForbiddenError, UnauthorizedError } from '../../core/errors/app-error';

export function authorize(...roles: AdminRole[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {

    if (!req.admin) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.admin.role)) {
      return next(
        new ForbiddenError(
          'You do not have permission to perform this action.',
        ),
      );
    }

    next();
  };
}

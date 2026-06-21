import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

import { fail } from '../../core/response/api-response';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error: any) {
      return res
        .status(422)
        .json(
          fail(
            'Validation failed',
            error.flatten?.() ?? error.message,
          ),
        );
    }
  };
}

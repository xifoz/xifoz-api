import { Request, Response, NextFunction } from 'express';
import { ContactStatus } from '@prisma/client';

import { ok } from '../../core/response/api-response';
import { contactService } from '../../services/admin/contact.service';

export class ContactController {
  async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await contactService.list({
        page: Number(req.query.page ?? 1),
        limit: Number(req.query.limit ?? 20),
        search: req.query.search as string | undefined,
        status: req.query.status as ContactStatus | undefined,
      });

      return res.json(
        ok(data, 'Contacts loaded successfully'),
      );
    } catch (error) {
      next(error);
    }
  }

  async get(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const data = await contactService.get(id);

      return res.json(
        ok(data, 'Contact loaded successfully'),
      );
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      const data = await contactService.updateStatus(
        id,
        req.body.status,
      );

      return res.json(
        ok(data, 'Contact status updated'),
      );
    } catch (error) {
      next(error);
    }
  }

  async remove(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      await contactService.remove(id);

      return res.json(
        ok(undefined, 'Contact deleted'),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const contactController =
  new ContactController();

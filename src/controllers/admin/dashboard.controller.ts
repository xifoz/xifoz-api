import { Request, Response, NextFunction } from 'express';

import { ok } from '../../core/response/api-response';
import { dashboardService } from '../../services/admin/dashboard.service';

export class DashboardController {
  async getDashboard(
    _req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await dashboardService.getDashboard();

      return res.json(
        ok(data, 'Dashboard loaded successfully'),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController =
  new DashboardController();

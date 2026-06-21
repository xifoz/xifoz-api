import { Router } from 'express';

import { authenticate } from '../../middleware/auth/authenticate';
import { dashboardController } from '../../controllers/admin/dashboard.controller';

const router = Router();

router.get(
  '/',
  authenticate,
  (req, res, next) =>
    void dashboardController.getDashboard(req, res, next),
);

export default router;

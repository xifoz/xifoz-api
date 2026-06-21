import { Router } from 'express';

import { authController } from '../../controllers/admin/auth.controller';
import { authenticate } from '../../middleware/auth/authenticate';

const router = Router();

router.post(
  '/login',
  (req, res, next) =>
    void authController.login(req, res, next),
);

router.post(
  '/logout',
  (req, res) =>
    void authController.logout(req, res),
);

router.get(
  '/me',
  authenticate,
  (req, res) =>
    void authController.me(req, res),
);

export default router;

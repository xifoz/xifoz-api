import { Request, Response, NextFunction } from 'express';

import { authService } from '../../services/admin/auth.service';

import {
  refreshCookieOptions,
  clearRefreshCookieOptions,
} from '../../security/cookies';

import {
  ok,
  fail,
} from '../../core/response/api-response';

export class AuthController {
  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await authService.login({
        email: req.body.email,
        password: req.body.password,
        ipAddress: req.ip,
        userAgent: req.get('user-agent') ?? '',
      });

      if (!result) {
        return res
          .status(401)
          .json(fail('Invalid email or password'));
      }

      res.cookie(
        'refresh_token',
        result.refreshToken,
        refreshCookieOptions,
      );

      return res.json(
        ok(
          {
            accessToken: result.accessToken,
            admin: {
              id: result.admin.id,
              email: result.admin.email,
              fullName: result.admin.fullName,
              role: result.admin.role,
            },
          },
          'Login successful',
        ),
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(
    _req: Request,
    res: Response,
  ) {
    res.clearCookie(
      'refresh_token',
      clearRefreshCookieOptions,
    );

    return res.json(
      ok(undefined, 'Logged out'),
    );
  }

  async me(
    req: Request,
    res: Response,
  ) {
    return res.json(ok(req.admin));
  }
}

export const authController =
  new AuthController();

import type { Request, Response, NextFunction } from 'express';

import { logger } from '../utils/logger.js';
import type { ApiResponse } from '../types/index.js';
import { AppError } from '../core/errors/app-error';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    method: req.method,
    path: req.path,
  });

  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
    };

    res.status(err.statusCode).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  };

  res.status(500).json(response);
}

export function notFoundHandler(
  req: Request,
  res: Response,
): void {
  const response: ApiResponse = {
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  };

  res.status(404).json(response);
}

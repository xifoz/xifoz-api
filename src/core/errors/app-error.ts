export class AppError extends Error {
  readonly statusCode: number;
  readonly expose: boolean;

  constructor(
    message: string,
    statusCode = 500,
    expose = false,
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.expose = expose;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, true);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, true);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422, true);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, true);
  }
}

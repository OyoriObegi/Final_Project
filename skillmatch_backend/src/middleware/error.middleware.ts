import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[${new Date().toISOString()}] ${error.stack}`);

  if (error instanceof ValidationError) {
    res.status(400).json({
      status: 'error',
      message: error.message,
      type: 'ValidationError'
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    res.status(401).json({
      status: 'error',
      message: error.message,
      type: 'AuthenticationError'
    });
    return;
  }

  if (error instanceof AuthorizationError) {
    res.status(403).json({
      status: 'error',
      message: error.message,
      type: 'AuthorizationError'
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({
      status: 'error',
      message: error.message,
      type: 'NotFoundError'
    });
    return;
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    type: 'ServerError'
  });
}; 
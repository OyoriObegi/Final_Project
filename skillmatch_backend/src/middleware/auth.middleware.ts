import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret_key'
    ) as { id: number; email: string; role: string };

    // Add user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as User['role'],
    } as User;

    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }
};

export const authorize = (roles: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      error: {
        code: 'UNAUTHORIZED',
        message: 'User not authenticated',
      },
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      error: {
        code: 'FORBIDDEN',
        message: 'User not authorized',
      },
    });
  }

  next();
}; 
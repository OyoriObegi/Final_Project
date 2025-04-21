import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../entities/User';
import { AuthenticationError, AuthorizationError } from './error.middleware';
import { config } from '../config';
import AppDataSource from '../config/database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('No authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError('User not authorized to perform this action')
      );
    }

    next();
  };
};

export const isRecruiterOrEmployer = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AuthenticationError('User not authenticated'));
  }

  if (![UserRole.RECRUITER, UserRole.EMPLOYER].includes(req.user.role)) {
    return next(
      new AuthorizationError('Only recruiters and employers can perform this action')
    );
  }

  next();
};

export const isOwnerOrAdmin = (resourceUserId: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (req.user.id !== resourceUserId && req.user.role !== UserRole.ADMIN) {
      return next(
        new AuthorizationError('User not authorized to perform this action')
      );
    }

    next();
  };
};

// Predefined middleware for common role checks
export const isAdmin = authorize([UserRole.ADMIN]);
export const isRecruiter = authorize([UserRole.RECRUITER]);
export const isSeeker = authorize([UserRole.SEEKER]);
export const isEmployer = authorize([UserRole.EMPLOYER]);

export const isRecruiterOrAdmin = authorize([UserRole.RECRUITER, UserRole.ADMIN]); 
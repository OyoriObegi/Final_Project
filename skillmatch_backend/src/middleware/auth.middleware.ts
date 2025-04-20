import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/User';
import { AuthenticationError, AuthorizationError } from './error.middleware';
import { config } from '../config';
import AppDataSource from '../config/database';

interface JwtPayload {
  id: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('User not found');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError('Insufficient permissions');
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
    throw new AuthenticationError('User not found');
  }

  if (req.user.role !== UserRole.RECRUITER && req.user.role !== UserRole.ADMIN) {
    throw new AuthorizationError('Must be a recruiter or admin to access this resource');
  }

  next();
};

export const isOwnerOrAdmin = (resourceUserId: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthenticationError('User not found');
    }

    if (req.user.id !== resourceUserId && req.user.role !== UserRole.ADMIN) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

// Predefined middleware for common role checks
export const isAdmin = authorize(UserRole.ADMIN);
export const isRecruiter = authorize(UserRole.RECRUITER);
export const isSeeker = authorize(UserRole.SEEKER);
export const isRecruiterOrAdmin = authorize(UserRole.RECRUITER, UserRole.ADMIN); 
import { UserRole } from '../entities/User';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    id: string;
    role: UserRole;
  }
} 
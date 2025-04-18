export type UserRole = 'job_seeker' | 'employer';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  location?: string;
  bio?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  location?: string;
  bio?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  location?: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone_number?: string;
  location?: string;
  bio?: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
} 
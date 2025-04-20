import { UserRole } from '../models/user.model';

export interface RegisterDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface UpdateProfileDTO {
    firstName?: string;
    lastName?: string;
    bio?: string;
    skills?: string[];
    avatar?: string;
}

export interface UserDTO {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
    isEmailVerified: boolean;
    bio?: string;
    skills?: string[];
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
} 
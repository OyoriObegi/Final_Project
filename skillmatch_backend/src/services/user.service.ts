import { getRepository, FindOptionsWhere, DeepPartial } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, UserStatus } from '../entities/User';
import { BaseService } from './base.service';
import { AuthenticationError, ValidationError } from '../middleware/error.middleware';
import AppDataSource from '../config/database';
import { config } from '../config';

interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string;
  position?: string;
}

interface LoginDTO {
  email: string;
  password: string;
}

interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  position?: string;
}

export class UserService extends BaseService<User> {
  constructor() {
    super(AppDataSource.getRepository(User));
  }

  async register(data: RegisterDTO): Promise<User> {
    const existingUser = await this.repository.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData: DeepPartial<User> = {
      ...data,
      password: hashedPassword,
      status: UserStatus.PENDING,
      emailVerified: false,
      verifiedAt: undefined,
      lastLoginAt: undefined,
      suspendedAt: undefined,
      loginCount: 0,
      isActive: true
    };

    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async login(data: LoginDTO): Promise<{ user: User; token: string }> {
    const user = await this.repository.findOne({
      where: { email: data.email },
      select: ['id', 'email', 'password', 'role', 'status']
    });

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AuthenticationError('Account is not active');
    }

    // Update login info
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await this.repository.save(user);

    const token = this.generateToken(user);

    return { user, token };
  }

  async updateProfile(userId: string, data: UpdateProfileDTO): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ValidationError('User not found');
    }
    
    Object.assign(user, data);
    return this.repository.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId }, select: ['id', 'password'] });
    if (!user) {
      throw new ValidationError('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new ValidationError('Current password is incorrect');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return this.repository.save(user);
  }

  async verifyEmail(userId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ValidationError('User not found');
    }

    user.emailVerified = true;
    user.verifiedAt = new Date();
    return this.repository.save(user);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
  }

  async findUsers(filters: { role?: UserRole; status?: UserStatus; isActive?: boolean }): Promise<User[]> {
    return this.repository.find({
      where: {
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status }),
        ...(typeof filters.isActive === 'boolean' && { isActive: filters.isActive })
      }
    });
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ValidationError('User not found');
    }

    user.isActive = !user.isActive;
    user.status = user.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    return this.repository.save(user);
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<User> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new ValidationError('User not found');
    }

    user.role = newRole;
    return this.repository.save(user);
  }
} 
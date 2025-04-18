import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { User, UserRole, CreateUserRequest } from '../types';
import { ApiResponse } from '../types';

export class UserService {
  private userRepository: UserRepository;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  async register(userData: CreateUserRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await this.userRepository.create({
        ...userData,
        password_hash: passwordHash,
      });

      // Generate token
      const token = this.generateToken(user);

      return { success: true, data: { user, token } };
    } catch (error) {
      console.error('Error in register:', error);
      return { success: false, error: 'Failed to register user' };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      const token = this.generateToken(user);
      return { success: true, data: { user, token } };
    } catch (error) {
      console.error('Error in login:', error);
      return { success: false, error: 'Failed to login' };
    }
  }

  async updateProfile(userId: number, data: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.update(userId, data);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, data: user };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<ApiResponse<boolean>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      const updated = await this.userRepository.updatePassword(userId, newPasswordHash);

      return { success: updated, data: updated };
    } catch (error) {
      console.error('Error in changePassword:', error);
      return { success: false, error: 'Failed to change password' };
    }
  }

  async getUserSkills(userId: number): Promise<ApiResponse<{ skill_id: number; name: string; proficiency_level: number }[]>> {
    try {
      const skills = await this.userRepository.getUserSkills(userId);
      return { success: true, data: skills };
    } catch (error) {
      console.error('Error in getUserSkills:', error);
      return { success: false, error: 'Failed to get user skills' };
    }
  }

  async updateUserSkills(
    userId: number,
    skills: { skill_id: number; proficiency_level: number }[]
  ): Promise<ApiResponse<boolean>> {
    try {
      // Remove existing skills
      const existingSkills = await this.userRepository.getUserSkills(userId);
      for (const skill of existingSkills) {
        await this.userRepository.removeUserSkill(userId, skill.skill_id);
      }

      // Add new skills
      for (const skill of skills) {
        await this.userRepository.addUserSkill(userId, skill.skill_id, skill.proficiency_level);
      }

      return { success: true, data: true };
    } catch (error) {
      console.error('Error in updateUserSkills:', error);
      return { success: false, error: 'Failed to update user skills' };
    }
  }

  async getEmployerDashboard(employerId: number): Promise<ApiResponse<any>> {
    try {
      const jobs = await this.userRepository.getEmployerJobs(employerId);
      return { success: true, data: jobs };
    } catch (error) {
      console.error('Error in getEmployerDashboard:', error);
      return { success: false, error: 'Failed to get employer dashboard' };
    }
  }

  async getJobSeekerDashboard(userId: number): Promise<ApiResponse<any>> {
    try {
      const applications = await this.userRepository.getJobSeekerApplications(userId);
      return { success: true, data: applications };
    } catch (error) {
      console.error('Error in getJobSeekerDashboard:', error);
      return { success: false, error: 'Failed to get job seeker dashboard' };
    }
  }
} 